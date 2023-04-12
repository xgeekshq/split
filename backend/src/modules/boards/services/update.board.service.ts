import Team from 'src/modules/teams/entities/team.schema';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import Board from '../entities/board.schema';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BOARD_PHASE_SERVER_UPDATED } from 'src/libs/constants/phase';
import { FRONTEND_URL } from 'src/libs/constants/frontend';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';
import PhaseChangeEvent from 'src/modules/socket/events/user-updated-phase.event';
import { SendMessageServiceInterface } from 'src/modules/communication/interfaces/send-message.service.interface';
import { SlackMessageDto } from 'src/modules/communication/dto/slack.message.dto';
import { SLACK_ENABLE, SLACK_MASTER_CHANNEL_ID } from 'src/libs/constants/slack';
import { ConfigService } from '@nestjs/config';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/delete.board.user.service.interface';
import { generateNewSubColumns } from '../utils/generate-subcolumns';
import { mergeCardsFromSubBoardColumnsIntoMainBoard } from '../utils/merge-cards-from-subboard';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { BoardNotFoundException } from 'src/libs/exceptions/boardNotFoundException';

@Injectable()
export default class UpdateBoardService implements UpdateBoardServiceInterface {
	private logger = new Logger(UpdateBoardService.name);

	constructor(
		@Inject(CommunicationsType.TYPES.services.SlackCommunicationService)
		private slackCommunicationService: CommunicationServiceInterface,
		@Inject(CommunicationsType.TYPES.services.SlackSendMessageService)
		private slackSendMessageService: SendMessageServiceInterface,
		private socketService: SocketGateway,
		@Inject(BoardUsers.TYPES.services.DeleteBoardUserService)
		private readonly deleteBoardUserService: DeleteBoardUserServiceInterface,
		@Inject(Boards.TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		private eventEmitter: EventEmitter2,
		private configService: ConfigService
	) {}

	async mergeBoards(subBoardId: string, userId: string, socketId?: string) {
		const [subBoard, board] = await Promise.all([
			this.boardRepository.getBoard(subBoardId),
			this.boardRepository.getBoardByQuery({ dividedBoards: { $in: [subBoardId] } })
		]);

		if (!subBoard || !board || subBoard.submitedByUser) {
			throw new BoardNotFoundException();
		}

		const columnsWithMergedCards = this.getColumnsFromMainBoardWithMergedCards(subBoard, board);
		let mergedBoard: Board;

		await this.boardRepository.startTransaction();

		try {
			try {
				const updatedMergedSubBoard = await this.boardRepository.updateMergedSubBoard(
					subBoardId,
					userId,
					true
				);

				if (!updatedMergedSubBoard) {
					this.logger.error('Update of the subBoard to be merged failed');
					throw new UpdateFailedException();
				}

				mergedBoard = await this.boardRepository.updateMergedBoard(
					board._id,
					columnsWithMergedCards,
					true
				);

				if (!mergedBoard) {
					this.logger.error('Update of the merged board failed');
					throw new UpdateFailedException();
				}

				if (board.slackChannelId && board.slackEnable) {
					this.slackCommunicationService.executeMergeBoardNotification({
						responsiblesChannelId: board.slackChannelId,
						teamNumber: subBoard.boardNumber,
						isLastSubBoard: await this.checkIfIsLastBoardToMerge(
							mergedBoard.dividedBoards as Board[]
						),
						boardId: subBoardId,
						mainBoardId: board._id
					});
				}

				if (socketId) {
					this.socketService.sendUpdatedAllBoard(subBoardId, socketId);
				}
			} catch (e) {
				await this.boardRepository.abortTransaction();
				throw new UpdateFailedException();
			}

			await this.boardRepository.commitTransaction();

			return mergedBoard;
		} catch (e) {
			throw new UpdateFailedException();
		} finally {
			await this.boardRepository.endSession();
		}
	}

	updateChannelId(teams: TeamDto[]) {
		Promise.all(
			teams.map((team) => this.boardRepository.updatedChannelId(team.boardId, team.channelId))
		);
	}

	// async updateBoardParticipants(addUsers: BoardUserDto[], removeUsers: string[]) {
	// 	try {
	// 		let createdBoardUsers: BoardUser[] = [];

	// 		if (addUsers.length > 0)
	// 			createdBoardUsers = await this.createBoardUserService.saveBoardUsers(addUsers);

	// 		if (removeUsers.length > 0) await this.deleteBoardUsers(removeUsers);

	// 		return createdBoardUsers;
	// 	} catch (error) {
	// 		throw new UpdateFailedException();
	// 	}
	// }

	// async updateBoardParticipantsRole(boardUserToUpdateRole: BoardUserDto) {
	// 	const user = boardUserToUpdateRole.user as User;

	// 	const updatedBoardUser = await this.updateBoardUserService.updateBoardUserRole(
	// 		boardUserToUpdateRole.board,
	// 		user._id,
	// 		boardUserToUpdateRole.role
	// 	);

	// 	if (!updatedBoardUser) {
	// 		throw new UpdateFailedException();
	// 	}

	// 	return updatedBoardUser;
	// }

	async updatePhase(boardPhaseDto: BoardPhaseDto) {
		try {
			const { boardId, phase } = boardPhaseDto;
			const board = await this.boardRepository.updatePhase(boardId, phase);

			this.eventEmitter.emit(BOARD_PHASE_SERVER_UPDATED, new PhaseChangeEvent(board));

			//Sends message to SLACK
			if (
				(board.team as Team).name === 'xgeeks' &&
				board.slackEnable === true &&
				board.phase !== BoardPhases.ADDCARDS &&
				this.configService.getOrThrow(SLACK_ENABLE)
			) {
				const message = this.generateMessage(board.phase, boardId, board.createdAt, board.columns);
				const slackMessageDto = new SlackMessageDto(
					this.configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
					message
				);
				this.slackSendMessageService.execute(slackMessageDto);
			}
		} catch (err) {
			throw new UpdateFailedException();
		}
	}

	/* --------------- HELPERS --------------- */

	private checkIfIsLastBoardToMerge(dividedBoards: Board[]): boolean {
		const count = dividedBoards.reduce((prev, currentValue) => {
			if (currentValue.submitedByUser) {
				return prev + 1;
			}

			return prev;
		}, 0);

		return count === dividedBoards.length;
	}

	/**
	 * Method to return columns with cards merged cards a from sub-board
	 * @param subBoard: Board
	 * @param board: Board
	 * @return Column[]
	 */
	private getColumnsFromMainBoardWithMergedCards(subBoard: Board, board: Board) {
		const newSubColumns = generateNewSubColumns(subBoard);

		return mergeCardsFromSubBoardColumnsIntoMainBoard([...board.columns], newSubColumns);
	}

	private generateMessage(phase: string, boardId: string, date: string, columns): string {
		const createdAt = new Date(date);
		const month = createdAt.toLocaleString('default', {
			month: 'long'
		});
		const frontendUrl = this.configService.getOrThrow(FRONTEND_URL);

		if (phase === BoardPhases.VOTINGPHASE) {
			return (
				`<!here> Hello team :xgeeks:,\n\nThe ${month} Retro Board is now ready to vote <${frontendUrl}/boards/${boardId}|HERE>, take a look and please add your votes.\n\n` +
				`If you spot any problem, remember to help the team, opening an issue on <https://github.com/xgeekshq/split/issues |split github repo> or reach out to the team using <#C02F0J7J99Q|split_dev> Slack channel.\n\n` +
				`Thank you for your collaboration! :ok_hand: Keep rocking :rocket:`
			);
		}

		if (phase === BoardPhases.SUBMITTED) {
			const { cards } = columns[2];
			let actionPoints = '';

			//Extracts the action points to a string
			cards.map((card) => {
				actionPoints += ` \u2022 ${card.text.replace(/\n{2,}/g, '\n\t')} \n`;
			});

			return (
				`Hello team :xgeeks:,\n\nThe ${month} <${frontendUrl}/boards/${boardId}|board> was submitted` +
				(actionPoints ? ' and these are the action points extracted:\n\n' : '!\n') +
				actionPoints +
				'\nThank you for your collaboration! :ok_hand: Keep rocking :rocket:'
			);
		}
	}

	// private async deleteBoardUsers(boardUsers: string[]) {
	// 	const deletedCount = await this.deleteBoardUserService.deleteBoardUsers(boardUsers);

	// 	if (deletedCount <= 0) throw new UpdateFailedException();
	// }
}

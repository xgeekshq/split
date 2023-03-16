import { UpdateBoardUserServiceInterface } from './../../boardusers/interfaces/services/update.board.user.service.interface';
import BoardUserDto from 'src/modules/boards/dto/board.user.dto';
import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	forwardRef
} from '@nestjs/common';
import { getIdFromObjectId } from 'src/libs/utils/getIdFromObjectId';
import isEmpty from 'src/libs/utils/isEmpty';
import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import * as Teams from 'src/modules/teams/interfaces/types';
import * as Cards from 'src/modules/cards/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardusers/interfaces/types';
import User from 'src/modules/users/entities/user.schema';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { ResponsibleType } from '../interfaces/responsible.interface';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import Board from '../entities/board.schema';
import BoardUser from '../entities/board.user.schema';
import { DELETE_FAILED, INSERT_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import Column from '../../columns/entities/column.schema';
import ColumnDto from '../../columns/dto/column.dto';
import { DeleteCardServiceInterface } from 'src/modules/cards/interfaces/services/delete.card.service.interface';
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
import Team from 'src/modules/teams/entities/teams.schema';
import { GetBoardUserServiceInterface } from 'src/modules/boardusers/interfaces/services/get.board.user.service.interface';
import { CreateBoardUserServiceInterface } from 'src/modules/boardusers/interfaces/services/create.board.user.service.interface';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardusers/interfaces/services/delete.board.user.service.interface';
import { generateNewSubColumns } from '../utils/generate-subcolumns';
import { mergeCardsFromSubBoardColumnsIntoMainBoard } from '../utils/merge-cards-from-subboard';

@Injectable()
export default class UpdateBoardService implements UpdateBoardServiceInterface {
	constructor(
		@Inject(forwardRef(() => Teams.TYPES.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface,
		@Inject(CommunicationsType.TYPES.services.SlackCommunicationService)
		private slackCommunicationService: CommunicationServiceInterface,
		@Inject(CommunicationsType.TYPES.services.SlackSendMessageService)
		private slackSendMessageService: SendMessageServiceInterface,
		private socketService: SocketGateway,
		@Inject(Cards.TYPES.services.DeleteCardService)
		private deleteCardService: DeleteCardServiceInterface,
		@Inject(BoardUsers.TYPES.services.CreateBoardUserService)
		private readonly createBoardUserService: CreateBoardUserServiceInterface,
		@Inject(BoardUsers.TYPES.services.GetBoardUserService)
		private readonly getBoardUserService: GetBoardUserServiceInterface,
		@Inject(BoardUsers.TYPES.services.UpdateBoardUserService)
		private readonly updateBoardUserService: UpdateBoardUserServiceInterface,
		@Inject(BoardUsers.TYPES.services.DeleteBoardUserService)
		private readonly deleteBoardUserService: DeleteBoardUserServiceInterface,
		@Inject(Boards.TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		private eventEmitter: EventEmitter2,
		private configService: ConfigService
	) {}

	async update(boardId: string, boardData: UpdateBoardDto) {
		/**
		 * Only can change the maxVotes if:
		 * - new maxVotes not empty
		 * - current highest votes equals to zero
		 * - or current highest votes lower than new maxVotes
		 */

		if (!isEmpty(boardData.maxVotes)) {
			const highestVotes = await this.getHighestVotesOnBoard(boardId);

			if (highestVotes > Number(boardData.maxVotes)) {
				throw new BadRequestException(
					`You can't set a lower value to max votes. Please insert a value higher or equals than ${highestVotes}!`
				);
			}
		}

		const board = await this.boardRepository.getBoard(boardId);

		if (!board) {
			throw new NotFoundException('Board not found!');
		}

		// Destructuring board/boardData variables
		const { isSubBoard } = board;
		const { responsible } = boardData;

		const currentResponsible = await this.getBoardResponsibleInfo(boardId);
		const newResponsible: ResponsibleType = {
			id: (responsible?.user as User)._id,
			email: (responsible?.user as User).email
		};

		/**
		 * Validate if:
		 * - have users on request
		 * - and the current responsible isn't the new responsible
		 */
		if (boardData.users && String(currentResponsible?.id) !== String(newResponsible?.id)) {
			this.changeResponsibleOnBoard(
				isSubBoard,
				boardId,
				boardData.mainBoardId,
				boardData.users,
				String(currentResponsible.id),
				String(newResponsible.id)
			);
		}

		/**
		 * Updates the board's settings fields
		 *
		 * */

		board.title = boardData.title;
		board.maxVotes = boardData.maxVotes;
		board.hideCards = boardData.hideCards;
		board.addCards = boardData.addCards;
		board.hideVotes = boardData.hideVotes;
		board.postAnonymously = boardData.postAnonymously;
		board.isPublic = boardData.isPublic;

		/**
		 * If the board is a regular, then updates its columns
		 *
		 * */
		if (!isSubBoard && isEmpty(board.dividedBoards)) {
			board.columns = await this.updateRegularBoard(boardId, boardData, board);
		}

		const updatedBoard = await this.boardRepository.updateBoard(boardId, board, true);

		if (!updatedBoard) throw new BadRequestException(UPDATE_FAILED);

		if (boardData.socketId) {
			this.socketService.sendUpdatedBoard(boardId, boardData.socketId);
		}

		if (
			updatedBoard &&
			newResponsible &&
			currentResponsible &&
			String(currentResponsible?.id) !== String(newResponsible?.id) &&
			board.slackChannelId &&
			updatedBoard.slackEnable &&
			updatedBoard.isSubBoard
		) {
			this.handleResponsibleSlackMessage(
				newResponsible,
				currentResponsible,
				board._id,
				board.slackChannelId,
				board.boardNumber
			);
		}

		return updatedBoard;
	}

	async mergeBoards(subBoardId: string, userId: string, socketId?: string) {
		const [subBoard, board] = await Promise.all([
			this.boardRepository.getBoard(subBoardId),
			this.boardRepository.getBoardByQuery({ dividedBoards: { $in: [subBoardId] } })
		]);

		if (!subBoard || !board || subBoard.submitedByUser)
			throw new BadRequestException(UPDATE_FAILED);

		const columnsWitMergedCards = this.getColumnsFromMainBoardWithMergedCards(subBoard, board);

		await this.boardRepository.startTransaction();
		try {
			const updatedMergedSubBoard = await this.boardRepository.updateMergedSubBoard(
				subBoardId,
				userId,
				true
			);

			if (!updatedMergedSubBoard) {
				throw new BadRequestException(UPDATE_FAILED);
			}

			const mergedBoard = await this.boardRepository.updateMergedBoard(
				board._id,
				columnsWitMergedCards,
				true
			);

			if (!mergedBoard) {
				throw new BadRequestException(UPDATE_FAILED);
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

			await this.boardRepository.commitTransaction();
			await this.boardRepository.endSession();

			return mergedBoard;
		} catch (e) {
			await this.boardRepository.abortTransaction();
		} finally {
			await this.boardRepository.endSession();
		}

		throw new BadRequestException(UPDATE_FAILED);
	}

	updateChannelId(teams: TeamDto[]) {
		Promise.all(
			teams.map((team) => this.boardRepository.updatedChannelId(team.boardId, team.channelId))
		);
	}

	async updateBoardParticipants(addUsers: BoardUserDto[], removeUsers: string[]) {
		try {
			let createdBoardUsers: BoardUser[] = [];

			if (addUsers.length > 0) createdBoardUsers = await this.addBoardUsers(addUsers);

			if (removeUsers.length > 0) await this.deleteBoardUsers(removeUsers);

			return createdBoardUsers;
		} catch (error) {
			throw new BadRequestException(UPDATE_FAILED);
		}
	}

	async updateBoardParticipantsRole(boardUserToUpdateRole: BoardUserDto) {
		const user = boardUserToUpdateRole.user as User;

		const updatedBoardUsers = await this.updateBoardUserService.updateBoardUserRole(
			boardUserToUpdateRole.board,
			user._id,
			boardUserToUpdateRole.role
		);

		if (!updatedBoardUsers) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		return updatedBoardUsers;
	}

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
			throw new BadRequestException(UPDATE_FAILED);
		}
	}

	/* --------------- HELPERS --------------- */

	/**
	 * Method to get the highest value of votesCount on Board Users
	 * @param boardId String
	 * @return number
	 */
	private async getHighestVotesOnBoard(boardId: string): Promise<number> {
		const votesCount = await this.getBoardUserService.getVotesCount(boardId);

		return votesCount.reduce(
			(prev, current) => (current.votesCount > prev ? current.votesCount : prev),
			0
		);
	}

	/**
	 * Method to get current responsible to a specific board
	 * @param boardId String
	 * @return Board User
	 * @private
	 */
	private async getBoardResponsibleInfo(boardId: string): Promise<ResponsibleType | undefined> {
		const boardUser = await this.getBoardUserService.getBoardResponsible(boardId);

		if (!boardUser) {
			return undefined;
		}

		const user = boardUser?.user as User;

		return { id: user._id, email: user.email };
	}

	/**
	 * Method to update all boardUsers role
	 * @param boardId String
	 * @param boardUsers BoardUserDto[]
	 * @param currentResponsibleId String
	 * @param newResponsibleId String
	 * @return void
	 * @private
	 */
	private async updateBoardUsersRole(
		boardId: string,
		boardUsers: BoardUserDto[],
		currentResponsibleId: string,
		newResponsibleId: string
	) {
		const promises = boardUsers
			.filter((boardUser) =>
				[getIdFromObjectId(currentResponsibleId), newResponsibleId].includes(
					(boardUser.user as User)._id
				)
			)
			.map((boardUser) => {
				const typedBoardUser = boardUser.user as User;

				return this.updateBoardUserService.updateBoardUserRole(
					boardId,
					typedBoardUser._id,
					boardUser.role
				);
			});
		await Promise.all(promises);
	}

	/**
	 * Method to change board responsible
	 * @return void
	 */
	private changeResponsibleOnBoard(
		isSubBoard: boolean,
		boardId: string,
		mainBoardId: string,
		users: BoardUserDto[],
		currentResponsibleId: string,
		newResponsibleId: string
	) {
		if (isSubBoard) {
			this.updateBoardUsersRole(boardId, users, currentResponsibleId, newResponsibleId);
		}

		this.updateBoardUsersRole(mainBoardId, users, currentResponsibleId, newResponsibleId);
	}

	private async updateRegularBoard(boardId: string, boardData: UpdateBoardDto, board: Board) {
		/**
		 * Validate if:
		 * - have columns to delete
		 * Returns the votes to the user
		 */
		if (boardData.deletedColumns && !isEmpty(boardData.deletedColumns)) {
			const cardsToDelete = boardData.deletedColumns.flatMap((deletedColumnId: string) => {
				return board.columns.find((column) => column._id.toString() === deletedColumnId)?.cards;
			});

			await this.deleteCardService.deleteCardVotesFromColumn(boardId, cardsToDelete);
		}

		/**
		 * Updates the columns
		 *
		 * */
		const columns = boardData.columns.flatMap((col: Column | ColumnDto) => {
			if (col._id) {
				const columnBoard = board.columns.find(
					(colBoard) => colBoard._id.toString() === col._id.toString()
				);

				if (columnBoard) {
					return [{ ...columnBoard, title: col.title }];
				}

				if (boardData.deletedColumns) {
					const columnToDelete = boardData.deletedColumns.some(
						(colId) => colId === col._id.toString()
					);

					if (columnToDelete) {
						return [];
					}
				}
			}

			return [{ ...col }];
		}) as Column[];

		return columns;
	}

	private async handleResponsibleSlackMessage(
		newResponsible: ResponsibleType,
		currentResponsible: ResponsibleType | undefined,
		boardId: string,
		slackChannelId: string,
		boardNumber: number
	) {
		this.slackCommunicationService.executeResponsibleChange({
			newResponsibleEmail: newResponsible.email,
			previousResponsibleEmail: currentResponsible?.email ?? '',
			subTeamChannelId: slackChannelId,
			responsiblesChannelId: (await this.boardRepository.getResponsiblesSlackId(boardId))
				?.slackChannelId,
			teamNumber: boardNumber,
			email: newResponsible.email
		});
	}

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
				`If you spot any problem, remember to help the team, opening an issue on <https://github.com/xgeekshq/split/issues |split github repo> or reach out to the team using <#split_dev> Slack channel.\n\n` +
				`Thank you for your collaboration! :ok_hand: Keep rocking :rocket:`
			);
		}

		if (phase === BoardPhases.SUBMITTED) {
			const { cards } = columns[2];
			let actionPoints = '';

			//Extracts the action points to a string
			cards.map((card) => {
				actionPoints += ` \u2022 ${card.text} \n`;
			});

			return (
				`Hello team :xgeeks:,\n\nThe ${month} <${frontendUrl}/boards/${boardId}|board> was submitted` +
				(actionPoints ? ' and these are the action points extracted:\n\n' : '!\n') +
				actionPoints +
				'\nThank you for your collaboration! :ok_hand: Keep rocking :rocket:'
			);
		}
	}

	private async addBoardUsers(boardUsers: BoardUserDto[]) {
		const createdBoardUsers = await this.createBoardUserService.saveBoardUsers(boardUsers);

		if (createdBoardUsers.length < 1) throw new Error(INSERT_FAILED);

		return createdBoardUsers;
	}

	private async deleteBoardUsers(boardUsers: string[]) {
		const deletedCount = await this.deleteBoardUserService.deleteBoardUsers(boardUsers);

		if (deletedCount <= 0) throw new Error(DELETE_FAILED);
	}
}

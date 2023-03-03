import BoardUserDto from 'src/modules/boards/dto/board.user.dto';
import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	forwardRef
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { getIdFromObjectId } from 'src/libs/utils/getIdFromObjectId';
import isEmpty from 'src/libs/utils/isEmpty';
import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import * as Teams from 'src/modules/teams/interfaces/types';
import * as Cards from 'src/modules/cards/interfaces/types';
import * as Boards from '../interfaces/types';
import User from 'src/modules/users/entities/user.schema';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { ResponsibleType } from '../interfaces/responsible.interface';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import Board, { BoardDocument } from '../entities/board.schema';
import BoardUser from '../entities/board.user.schema';
import { DELETE_FAILED, INSERT_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import Column from '../../columns/entities/column.schema';
import ColumnDto from '../../columns/dto/column.dto';
import { DeleteCardService } from 'src/modules/cards/interfaces/services/delete.card.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BOARD_PHASE_SERVER_UPDATED } from 'src/libs/constants/phase';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';
import PhaseChangeEvent from 'src/modules/socket/events/user-updated-phase.event';
import { BoardUserRepositoryInterface } from '../repositories/board-user.repository.interface';

@Injectable()
export default class UpdateBoardServiceImpl implements UpdateBoardServiceInterface {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@Inject(forwardRef(() => Teams.TYPES.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface,
		@Inject(CommunicationsType.TYPES.services.SlackCommunicationService)
		private slackCommunicationService: CommunicationServiceInterface,
		private socketService: SocketGateway,
		@Inject(Cards.TYPES.services.DeleteCardService)
		private deleteCardService: DeleteCardService,
		@Inject(Boards.TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(Boards.TYPES.repositories.BoardUserRepository)
		private readonly boardUserRepository: BoardUserRepositoryInterface,
		private eventEmitter: EventEmitter2
	) {}

	/**
	 * Method to get current responsible to a specific board
	 * @param boardId String
	 * @return Board User
	 * @private
	 */
	private async getBoardResponsibleInfo(boardId: string): Promise<ResponsibleType | undefined> {
		const boardUser = await this.boardUserRepository.getBoardResponsible(boardId);

		if (!boardUser) {
			return undefined;
		}

		const user = boardUser?.user as User;

		return { id: user._id, email: user.email };
	}

	/**
	 * Method to get the highest value of votesCount on Board Users
	 * @param boardId String
	 * @return number
	 */
	private async getHighestVotesOnBoard(boardId: string): Promise<number> {
		const votesCount = await this.boardUserRepository.getVotesCount(boardId);

		return votesCount.reduce(
			(prev, current) => (current.votesCount > prev ? current.votesCount : prev),
			0
		);
	}

	async update(boardId: string, boardData: UpdateBoardDto) {
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
			if (isSubBoard) {
				const promises = boardData.users
					.filter((boardUser) =>
						[getIdFromObjectId(String(currentResponsible?.id)), String(newResponsible.id)].includes(
							(boardUser.user as unknown as User)._id
						)
					)
					.map((boardUser) => {
						const typedBoardUser = boardUser.user as unknown as User;

						return this.boardUserRepository.updateBoardUserRole(
							boardId,
							typedBoardUser._id,
							boardUser.role
						);
					});
				await Promise.all(promises);
			}

			/**
			 * TODO:
			 * When the mainBoardId starts to be returned by the board, remove this query from the board repository
			 */
			const mainBoardId = await this.boardRepository.getMainBoardOfSubBoard(boardId);

			const promises = boardData.users
				.filter((boardUser) =>
					[getIdFromObjectId(String(currentResponsible?.id)), newResponsible.id].includes(
						(boardUser.user as unknown as User)._id
					)
				)
				.map((boardUser) => {
					const typedBoardUser = boardUser.user as unknown as User;

					return this.boardUserRepository.updateBoardUserRole(
						mainBoardId._id,
						typedBoardUser._id,
						boardUser.role
					);
				});
			await Promise.all(promises);
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

		/**
		 * Only can change the maxVotes if:
		 * - new maxVotes not empty
		 * - current highest votes equals to zero
		 * - or current highest votes lower than new maxVotes
		 */

		if (!isEmpty(boardData.maxVotes)) {
			const highestVotes = await this.getHighestVotesOnBoard(boardId);

			// TODO: maxVotes as 'undefined' not undefined (so typeof returns string, but needs to be number or undefined)
			if (highestVotes > Number(boardData.maxVotes)) {
				throw new BadRequestException(
					`You can't set a lower value to max votes. Please insert a value higher or equals than ${highestVotes}!`
				);
			}
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

	async updateRegularBoard(boardId: string, boardData: UpdateBoardDto, board: Board) {
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

	async mergeBoards(subBoardId: string, userId: string) {
		const [subBoard, board] = await Promise.all([
			this.boardRepository.getBoard(subBoardId),
			this.boardRepository.getBoardByQuery({ dividedBoards: { $in: [subBoardId] } })
		]);

		if (!subBoard || !board || subBoard.submitedByUser) return null;
		const team = await this.getTeamService.getTeam((board.team as ObjectId).toString());

		if (!team) return null;

		const newSubColumns = this.generateNewSubColumns(subBoard as Board);

		const newColumns = [...(board as Board).columns];
		for (let i = 0; i < newColumns.length; i++) {
			newColumns[i].cards = [...newColumns[i].cards, ...newSubColumns[i].cards];
		}

		await this.boardRepository.updateMergedSubBoard(subBoardId, userId);

		const result = await this.boardRepository.updateMergedBoard(board._id, newColumns);

		if (board.slackChannelId && board.slackEnable) {
			this.slackCommunicationService.executeMergeBoardNotification({
				responsiblesChannelId: board.slackChannelId,
				teamNumber: subBoard.boardNumber,
				isLastSubBoard: await this.checkIfIsLastBoardToMerge(board._id),
				boardId: subBoardId,
				mainBoardId: board._id
			});
		}

		return result;
	}

	private async checkIfIsLastBoardToMerge(mainBoardId: string): Promise<boolean> {
		const board = await this.boardRepository.getBoardPopulated(mainBoardId, {
			path: 'dividedBoards'
		});

		if (!board) return false;

		const count = (board.dividedBoards as Board[]).reduce((prev, currentValue) => {
			if (currentValue.submitedByUser) {
				prev -= 1;

				return prev;
			}

			return prev;
		}, board?.dividedBoards.length ?? 0);

		return count === 0;
	}

	private generateNewSubColumns(subBoard: Board) {
		return [...subBoard.columns].map((column) => {
			const newColumn = {
				title: column.title,
				color: column.color,
				cards: column.cards.map((card) => {
					const newCard = {
						text: card.text,
						createdBy: card.createdBy,
						votes: card.votes,
						anonymous: card.anonymous,
						createdByTeam: subBoard.title.replace('board', ''),
						comments: card.comments.map((comment) => {
							return {
								text: comment.text,
								createdBy: comment.createdBy,
								anonymous: comment.anonymous
							};
						}),
						items: card.items.map((cardItem) => {
							return {
								text: cardItem.text,
								votes: cardItem.votes,
								createdByTeam: subBoard.title.replace('board ', ''),
								createdBy: cardItem.createdBy,
								anonymous: cardItem.anonymous,
								comments: cardItem.comments.map((comment) => {
									return {
										text: comment.text,
										createdBy: comment.createdBy,
										anonymous: comment.anonymous
									};
								}),
								createdAt: card.createdAt
							};
						}),
						createdAt: card.createdAt
					};

					return newCard;
				})
			};

			return newColumn;
		});
	}

	updateChannelId(teams: TeamDto[]) {
		Promise.all(
			teams.map((team) => this.boardRepository.updatedChannelId(team.boardId, team.channelId))
		);
	}

	async updateBoardParticipantsRole(boardUserToUpdateRole: BoardUserDto) {
		const user = boardUserToUpdateRole.user as unknown as User;

		const updatedBoardUsers = await this.boardUserRepository.updateBoardUserRole(
			boardUserToUpdateRole.board,
			user._id,
			boardUserToUpdateRole.role
		);

		if (!updatedBoardUsers) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		return updatedBoardUsers;
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

	async updatePhase(boardPhaseDto: BoardPhaseDto) {
		try {
			const { boardId, phase } = boardPhaseDto;

			await this.boardRepository.updateBoardPhase(boardId, phase);

			this.eventEmitter.emit(BOARD_PHASE_SERVER_UPDATED, new PhaseChangeEvent(boardPhaseDto));
		} catch (err) {
			throw new BadRequestException(UPDATE_FAILED);
		}
	}

	private async addBoardUsers(boardUsers: BoardUserDto[]) {
		const createdBoardUsers = await this.boardUserRepository.createBoardUsers(boardUsers);

		if (createdBoardUsers.length < 1) throw new Error(INSERT_FAILED);

		return createdBoardUsers;
	}

	private async deleteBoardUsers(boardUsers: string[]) {
		const deletedCount = await this.boardUserRepository.deleteBoardUsers(boardUsers);

		if (deletedCount <= 0) throw new Error(DELETE_FAILED);
	}
}

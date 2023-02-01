import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	forwardRef
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { getIdFromObjectId } from 'src/libs/utils/getIdFromObjectId';
import isEmpty from 'src/libs/utils/isEmpty';
import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import * as Teams from 'src/modules/teams/interfaces/types';
import * as Votes from 'src/modules/votes/interfaces/types';
import User, { UserDocument } from 'src/modules/users/entities/user.schema';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { ResponsibleType } from '../interfaces/responsible.interface';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';
import { BoardDataPopulate } from '../utils/populate-board';
import { UpdateColumnDto } from '../dto/column/update-column.dto';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import Column from '../schemas/column.schema';

@Injectable()
export default class UpdateBoardServiceImpl implements UpdateBoardServiceInterface {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@Inject(forwardRef(() => Teams.TYPES.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface,
		@Inject(CommunicationsType.TYPES.services.SlackCommunicationService)
		private slackCommunicationService: CommunicationServiceInterface,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>,
		private socketService: SocketGateway,
		@Inject(Votes.TYPES.services.DeleteVoteService)
		private deleteVoteService: DeleteVoteServiceInterface
	) {}

	/**
	 * Method to get current responsible to a specific board
	 * @param boardId String
	 * @return Board User
	 * @private
	 */
	private async getBoardResponsibleInfo(boardId: string): Promise<ResponsibleType | undefined> {
		const boardUser = await this.boardUserModel
			.findOne({ board: boardId, role: BoardRoles.RESPONSIBLE })
			.populate({ path: 'user' })
			.exec();

		if (!boardUser) {
			return undefined;
		}

		const user = boardUser?.user as UserDocument;

		return { id: user._id, email: user.email };
	}

	/**
	 * Method to get the highest value of votesCount on Board Users
	 * @param boardId String
	 * @return number
	 */
	private async getHighestVotesOnBoard(boardId: string): Promise<number> {
		const votesCount = await this.boardUserModel.find({ board: boardId }, ['votesCount']);

		return votesCount.reduce(
			(prev, current) => (current.votesCount > prev ? current.votesCount : prev),
			0
		);
	}

	async update(boardId: string, boardData: UpdateBoardDto) {
		const board = await this.boardModel.findById(boardId).exec();

		if (!board) {
			throw new NotFoundException('Board not found!');
		}

		// Destructuring board variables
		const { isSubBoard } = board;

		if (boardData.deletedColumns && !isEmpty(boardData.deletedColumns)) {
			const cardsToDelete = boardData.deletedColumns.flatMap((deletedColumnId: string) => {
				return board.columns.find((column) => column._id.toString() === deletedColumnId)?.cards;
			});

			cardsToDelete.forEach((cards) => {
				cards.items.forEach(async (card) => {
					const votesByUser = new Map<string, number>();

					card.votes.forEach((userId) => {
						if (!votesByUser.has(userId.toString())) {
							votesByUser.set(userId.toString(), 1);
						} else {
							const count = votesByUser.get(userId.toString());

							votesByUser.set(userId.toString(), count + 1);
						}
					});

					votesByUser.forEach(async (votesCount, userId) => {
						await this.deleteVoteService.decrementVoteUser(board.id, userId, -votesCount);
					});
				});
			});
		}

		const currentResponsible = await this.getBoardResponsibleInfo(boardId);
		const newResponsible: ResponsibleType = { id: currentResponsible?.id, email: '' };

		/**
		 * Validate if:
		 * - have users on request
		 * - is a sub-board
		 * - and the logged user isn't the current responsible
		 */
		if (isSubBoard && boardData.users) {
			const boardUserFound = boardData.users?.find(
				(userFound) => userFound.role === BoardRoles.RESPONSIBLE
			).user as unknown as User;

			newResponsible.email = boardUserFound.email;
			newResponsible.id = boardUserFound._id;
			const promises = boardData.users
				.filter((boardUser) =>
					[getIdFromObjectId(String(currentResponsible?.id)), newResponsible.id].includes(
						(boardUser.user as unknown as User)._id
					)
				)
				.map(async (boardUser) => {
					const typedBoardUser = boardUser.user as unknown as User;

					return this.boardUserModel
						.findOneAndUpdate(
							{
								user: typedBoardUser._id,
								board: boardId
							},
							{
								role: boardUser.role
							}
						)
						.exec();
				});
			await Promise.all(promises);
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

		/**
		 * Only updates the
		 *
		 * */

		board.title = boardData.title;
		board.maxVotes = boardData.maxVotes;
		board.hideCards = boardData.hideCards;
		board.addCards = boardData.addCards;
		board.hideVotes = boardData.hideVotes;

		/**
		 * Only the regular boards will have their columns updated
		 *
		 * */

		if (!isSubBoard && isEmpty(boardData.dividedBoards)) {
			board.columns = boardData.columns.flatMap((col) => {
				if (col._id) {
					const columnBoard = board.columns.find((colBoard) => colBoard._id === col._id.toString());

					if (columnBoard) {
						return [{ ...col, title: columnBoard.title }];
					}

					const columnToDelete = boardData.deletedColumns.some(
						(colId) => colId === col._id.toString()
					);

					if (columnToDelete) {
						return [];
					}
				}

				return [{ ...col }];
			}) as Column[];
		}

		const updatedBoard = await this.boardModel
			.findOneAndUpdate(
				{
					_id: boardId
				},
				{
					...board,
					users: boardData.users
				},
				{
					new: true
				}
			)
			.lean()
			.exec();

		if (
			updatedBoard &&
			String(currentResponsible?.id) !== newResponsible.id &&
			board.slackChannelId &&
			updatedBoard.slackEnable &&
			updatedBoard.isSubBoard
		) {
			this.handleResponsibleSlackMessage(
				newResponsible,
				currentResponsible,
				board._id,
				board.title,
				board.slackChannelId
			);
		}

		return updatedBoard;
	}

	private async handleResponsibleSlackMessage(
		newResponsible: ResponsibleType,
		currentResponsible: ResponsibleType | undefined,
		boardId: string,
		boardTitle: string,
		slackChannelId: string
	) {
		this.slackCommunicationService.executeResponsibleChange({
			newResponsibleEmail: newResponsible.email,
			previousResponsibleEmail: currentResponsible?.email ?? '',
			subTeamChannelId: slackChannelId,
			responsiblesChannelId: (await this.boardModel.findOne({ dividedBoards: { $in: [boardId] } }))
				?.slackChannelId,
			teamNumber: Number(boardTitle[boardTitle.length - 1]),
			email: newResponsible.email
		});
	}

	async mergeBoards(subBoardId: string, userId: string) {
		const [subBoard, board] = await Promise.all([
			this.boardModel.findById(subBoardId).lean().exec(),
			this.boardModel
				.findOne({ dividedBoards: { $in: [subBoardId] } })
				.lean()
				.exec()
		]);

		if (!subBoard || !board || subBoard.submitedByUser) return null;
		const team = await this.getTeamService.getTeam((board.team as ObjectId).toString());

		if (!team) return null;

		const newSubColumns = this.generateNewSubColumns(subBoard as Board);

		const newColumns = [...(board as Board).columns];
		for (let i = 0; i < newColumns.length; i++) {
			newColumns[i].cards = [...newColumns[i].cards, ...newSubColumns[i].cards];
		}

		this.boardModel
			.findOneAndUpdate(
				{
					_id: subBoardId
				},
				{
					$set: {
						submitedByUser: userId,
						submitedAt: new Date()
					}
				}
			)
			.lean()
			.exec();

		const result = this.boardModel
			.findOneAndUpdate(
				{
					_id: board._id
				},
				{
					$set: { columns: newColumns }
				},
				{ new: true }
			)
			.lean()
			.exec();

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
		const board = await this.boardModel.findById(mainBoardId).populate({ path: 'dividedBoards' });

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
			teams.map((team) =>
				this.boardModel.updateOne({ _id: team.boardId }, { slackChannelId: team.channelId })
			)
		);
	}

	updateColumn(boardId: string, column: UpdateColumnDto) {
		const board = this.boardModel
			.findOneAndUpdate(
				{
					_id: boardId,
					'columns._id': column._id
				},
				{
					$set: {
						'columns.$[column].color': column.color,
						'columns.$[column].title': column.title,
						'columns.$[column].cardText': column.cardText,
						'columns.$[column].isDefaultText': column.isDefaultText
					}
				},
				{
					arrayFilters: [{ 'column._id': column._id }],
					new: true
				}
			)
			.populate(BoardDataPopulate)
			.lean()
			.exec();

		if (!board) throw new BadRequestException(UPDATE_FAILED);

		if (column.socketId) this.socketService.sendUpdatedBoard(boardId, column.socketId);

		return board;
	}
}

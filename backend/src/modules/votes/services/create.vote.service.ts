import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { BOARD_NOT_FOUND, INSERT_VOTE_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import BoardUser, { BoardUserDocument } from 'src/modules/boards/schemas/board.user.schema';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';

@Injectable()
export default class CreateVoteServiceImpl implements CreateVoteServiceInterface {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>
	) {}

	private async canUserVote(boardId: string, userId: string, count: number): Promise<boolean> {
		const board = await this.boardModel.findById(boardId).exec();

		if (!board) {
			throw new NotFoundException(BOARD_NOT_FOUND);
		}

		if (board.maxVotes === null || board.maxVotes === undefined) {
			return true;
		}
		const maxVotes = Number(board.maxVotes);

		const boardUserFound = await this.boardUserModel
			.findOne({ board: boardId, user: userId })
			.exec();

		const userCanVote = boardUserFound?.votesCount !== undefined && boardUserFound?.votesCount >= 0;

		return userCanVote ? boardUserFound.votesCount + count <= maxVotes : false;
	}

	private async incrementVoteUser(
		boardId: string,
		userId: string,
		count: number,
		session?: ClientSession
	) {
		const boardUser = await this.boardUserModel
			.updateOne(
				{
					user: userId,
					board: boardId
				},
				{
					$inc: { votesCount: count }
				},
				{
					session
				}
			)
			.lean()
			.exec();

		if (boardUser.modifiedCount !== 1) throw new BadRequestException(UPDATE_FAILED);
	}

	async addVoteToCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number
	) {
		const canUserVote = await this.canUserVote(boardId, userId, count);

		if (!canUserVote) throw new BadRequestException(INSERT_VOTE_FAILED);

		const userSession = await this.boardUserModel.db.startSession();
		userSession.startTransaction();
		const session = await this.boardModel.db.startSession();
		session.startTransaction();
		try {
			await this.incrementVoteUser(boardId, userId, count, userSession);
			const board = await this.boardModel
				.updateOne(
					{
						_id: boardId,
						'columns.cards.items._id': cardItemId
					},
					{
						$push: {
							'columns.$.cards.$[c].items.$[i].votes': Array(count).fill(userId)
						}
					},
					{
						arrayFilters: [{ 'c._id': cardId }, { 'i._id': cardItemId }],
						session
					}
				)
				.lean()
				.exec();

			if (board.modifiedCount !== 1) throw new BadRequestException(INSERT_VOTE_FAILED);

			await userSession.commitTransaction();
			await session.commitTransaction();
		} catch (e) {
			await userSession.abortTransaction();
			await session.abortTransaction();
			throw new BadRequestException(INSERT_VOTE_FAILED);
		} finally {
			await userSession.endSession();
			await session.endSession();
		}
	}

	async addVoteToCardGroup(boardId: string, cardId: string, userId: string, count: number) {
		const canUserVote = await this.canUserVote(boardId, userId, count);

		if (!canUserVote) throw new BadRequestException(INSERT_VOTE_FAILED);

		const userSession = await this.boardUserModel.db.startSession();
		userSession.startTransaction();
		const session = await this.boardModel.db.startSession();
		session.startTransaction();
		try {
			await this.incrementVoteUser(boardId, userId, count, userSession);
			const board = await this.boardModel
				.updateOne(
					{
						_id: boardId,
						'columns.cards._id': cardId
					},
					{
						$push: {
							'columns.$.cards.$[c].votes': Array(count).fill(userId)
						}
					},
					{
						arrayFilters: [{ 'c._id': cardId }],
						session
					}
				)
				.lean()
				.exec();

			if (board.modifiedCount !== 1) throw new BadRequestException(INSERT_VOTE_FAILED);
			await session.commitTransaction();
			await userSession.commitTransaction();
		} catch (e) {
			await session.abortTransaction();
			await userSession.abortTransaction();
			throw new BadRequestException(INSERT_VOTE_FAILED);
		} finally {
			await userSession.endSession();
			await session.endSession();
		}
	}
}

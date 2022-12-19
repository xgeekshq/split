import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import BoardUser, { BoardUserDocument } from 'src/modules/boards/schemas/board.user.schema';
import { CreateVoteService } from '../interfaces/services/create.vote.service.interface';

@Injectable()
export default class CreateVoteServiceImpl implements CreateVoteService {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>
	) {}

	private async canUserVote(boardId: string, userId: string): Promise<boolean> {
		const board = await this.boardModel.findById(boardId).exec();

		if (!board) {
			throw new NotFoundException('Board not found!');
		}

		if (board.maxVotes === null || board.maxVotes === undefined) {
			return true;
		}
		const maxVotes = Number(board.maxVotes);

		const boardUserFound = await this.boardUserModel
			.findOne({ board: boardId, user: userId })
			.exec();

		const userCanVote = boardUserFound?.votesCount !== undefined && boardUserFound?.votesCount >= 0;

		return userCanVote ? boardUserFound.votesCount + 1 <= maxVotes : false;
	}

	private async incrementVoteUser(boardId: string, userId: string) {
		const boardUser = await this.boardUserModel
			.findOneAndUpdate(
				{
					user: userId,
					board: boardId
				},
				{
					$inc: { votesCount: 1 }
				}
			)
			.lean()
			.exec();

		if (!boardUser) throw new BadRequestException(UPDATE_FAILED);

		return boardUser;
	}

	async addVoteToCard(boardId: string, cardId: string, userId: string, cardItemId: string) {
		const canUserVote = await this.canUserVote(boardId, userId);

		if (canUserVote) {
			const dbSession = await this.boardModel.db.startSession();
			dbSession.startTransaction();
			try {
				await this.incrementVoteUser(boardId, userId);
				const board = await this.boardModel
					.findOneAndUpdate(
						{
							_id: boardId,
							'columns.cards.items._id': cardItemId
						},
						{
							$push: {
								'columns.$.cards.$[c].items.$[i].votes': userId
							},
							$inc: { totalUsedVotes: 1 }
						},
						{
							arrayFilters: [{ 'c._id': cardId }, { 'i._id': cardItemId }],
							new: true
						}
					)
					.populate({
						path: 'users',
						select: 'user role votesCount -board',
						populate: { path: 'user', select: 'firstName lastName _id' }
					})
					.lean()
					.exec();

				if (!board) throw Error(UPDATE_FAILED);
				await dbSession.commitTransaction();

				return board;
			} catch (error) {
				await dbSession.abortTransaction();
			} finally {
				await dbSession.endSession();
			}
		}
		throw new BadRequestException('Error adding a vote');
	}

	async addVoteToCardGroup(boardId: string, cardId: string, userId: string) {
		const canUserVote = await this.canUserVote(boardId, userId);

		if (canUserVote) {
			const dbSession = await this.boardModel.db.startSession();
			dbSession.startTransaction();
			try {
				await this.incrementVoteUser(boardId, userId);
				const board = await this.boardModel
					.findOneAndUpdate(
						{
							_id: boardId,
							'columns.cards._id': cardId
						},
						{
							$push: {
								'columns.$.cards.$[c].votes': userId
							}
						},
						{
							arrayFilters: [{ 'c._id': cardId }],
							new: true
						}
					)
					.populate({
						path: 'users',
						select: 'user role votesCount -board',
						populate: { path: 'user', select: 'firstName lastName _id' }
					})
					.lean()
					.exec();

				await dbSession.commitTransaction();

				return board;
			} catch (error) {
				await dbSession.abortTransaction();
				throw error;
			} finally {
				await dbSession.endSession();
			}
		}
		throw new BadRequestException('Error adding a vote');
	}
}

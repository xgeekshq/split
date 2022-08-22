import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UPDATE_FAILED } from 'libs/exceptions/messages';
import Board, { BoardDocument } from 'modules/boards/schemas/board.schema';
import BoardUser, { BoardUserDocument } from 'modules/boards/schemas/board.user.schema';

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
		const maxVotes = Number(board?.maxVotes);

		// userFound
		const userFound = await this.boardUserModel.find({ board: boardId, user: userId });
		const voteAllowed = userFound[0].votesCount + 1 <= maxVotes;
		return maxVotes === null || voteAllowed;
	}

	private async incrementVoteUser(boardId: string, userId: string) {
		const boardUser = this.boardUserModel
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
		if (!boardUser) throw Error(UPDATE_FAILED);
		return boardUser;
	}

	async addVoteToCard(boardId: string, cardId: string, userId: string, cardItemId: string) {
		const canUserVote = await this.canUserVote(boardId, userId);
		if (canUserVote) {
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
			return board;
		}
		throw new BadRequestException('Error adding a vote');
	}

	async addVoteToCardGroup(boardId: string, cardId: string, userId: string) {
		const canUserVote = await this.canUserVote(boardId, userId);
		if (canUserVote) {
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
				.lean()
				.exec();
			return board;
		}
		throw new BadRequestException('Error adding a vote');
	}
}

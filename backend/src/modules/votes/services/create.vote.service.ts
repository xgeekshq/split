import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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

	incrementVoteUser(boardId: string, userId: string) {
		return this.boardUserModel
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
	}

	addVoteToCard(boardId: string, cardId: string, userId: string, cardItemId: string) {
		this.incrementVoteUser(boardId, userId);
		return this.boardModel
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
	}

	addVoteToCardGroup(boardId: string, cardId: string, userId: string) {
		this.incrementVoteUser(boardId, userId);
		return this.boardModel
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
	}
}

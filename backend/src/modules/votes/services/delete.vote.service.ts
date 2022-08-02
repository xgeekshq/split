import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UPDATE_FAILED } from 'libs/exceptions/messages';
import { arrayIdToString } from 'libs/utils/arrayIdToString';
import isEmpty from 'libs/utils/isEmpty';
import Board, { BoardDocument } from 'modules/boards/schemas/board.schema';
import BoardUser, { BoardUserDocument } from 'modules/boards/schemas/board.user.schema';
import { GetCardService } from 'modules/cards/interfaces/services/get.card.service.interface';
import { TYPES } from 'modules/cards/interfaces/types';

import { DeleteVoteService } from '../interfaces/services/delete.vote.service.interface';

@Injectable()
export default class DeleteVoteServiceImpl implements DeleteVoteService {
	constructor(
		@InjectModel(Board.name)
		private boardModel: Model<BoardDocument>,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>,
		@Inject(TYPES.services.GetCardService)
		private getCardService: GetCardService
	) {}

	async decrementVoteUser(boardId: string, userId: string, count?: number) {
		const boardUser = await this.boardUserModel.findOneAndUpdate(
			{
				user: userId,
				board: boardId
			},
			{
				$inc: { votesCount: !count ? -1 : -count }
			}
		);
		if (!boardUser) throw Error(UPDATE_FAILED);
		return boardUser;
	}

	async deleteVoteFromCard(boardId: string, cardId: string, userId: string, cardItemId: string) {
		const card = await this.getCardService.getCardFromBoard(boardId, cardId);
		if (!card) return null;

		const cardItem = card.items.find((item) => item._id.toString() === cardItemId);
		if (!cardItem) return null;

		const votes = cardItem.votes as unknown as string[];

		const voteIndex = votes.findIndex((vote) => vote.toString() === userId.toString());

		if (voteIndex === -1) return null;

		votes.splice(voteIndex, 1);

		await this.decrementVoteUser(boardId, userId);
		const board = await this.boardModel.findOneAndUpdate(
			{
				_id: boardId,
				'columns.cards.items._id': cardItemId
			},
			{
				$set: {
					'columns.$.cards.$[c].items.$[i].votes': votes
				}
			},
			{
				arrayFilters: [{ 'c._id': cardId }, { 'i._id': cardItemId }],
				new: true
			}
		);

		if (!board) throw Error(UPDATE_FAILED);
		return board.populate({
			path: 'users',
			select: 'user role votesCount -board',
			populate: { path: 'user', select: 'firstName lastName _id' }
		});
	}

	async deleteVoteFromCardGroup(boardId: string, cardId: string, userId: string) {
		const card = await this.getCardService.getCardFromBoard(boardId, cardId);
		if (!card) return null;

		const { votes } = card;
		const newVotes = arrayIdToString(votes as unknown as string[]);

		if (isEmpty(votes.length)) {
			const item = card.items.find(({ votes: itemVotes }) =>
				arrayIdToString(itemVotes as unknown as string[]).includes(userId.toString())
			);

			if (!item) return null;

			const boardUser = await this.deleteVoteFromCard(boardId, cardId, userId, item._id.toString());

			return boardUser;
		}

		const voteIndex = newVotes.findIndex((vote) => vote.toString() === userId.toString());
		if (voteIndex === -1) return null;
		newVotes.splice(voteIndex, 1);

		await this.decrementVoteUser(boardId, userId);
		const board = await this.boardModel
			.findOneAndUpdate(
				{
					_id: boardId,
					'columns.cards._id': cardId
				},
				{
					$set: {
						'columns.$.cards.$[c].votes': newVotes
					}
				},
				{
					arrayFilters: [{ 'c._id': cardId }],
					new: true
				}
			)
			.lean()
			.exec();
		if (!board) throw Error(UPDATE_FAILED);
		return board;
	}
}

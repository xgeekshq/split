import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CARD_NOT_FOUND, CARD_NOT_REMOVED, UPDATE_FAILED } from 'libs/exceptions/messages';
import Board, { BoardDocument } from 'modules/boards/schemas/board.schema';

import { GetCardService } from '../interfaces/services/get.card.service.interface';
import { MergeCardService } from '../interfaces/services/merge.card.service.interface';
import { TYPES } from '../interfaces/types';
import { pullCard } from '../shared/pull.card';

export class MergeCardServiceImpl implements MergeCardService {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@Inject(TYPES.services.GetCardService)
		private readonly cardService: GetCardService
	) {}

	async mergeCards(boardId: string, draggedCardId: string, cardId: string) {
		const session = await this.boardModel.db.startSession();
		session.startTransaction();

		try {
			const cardToMove = await this.cardService.getCardFromBoard(boardId, draggedCardId);

			if (!cardToMove) return null;

			const pullResult = await pullCard(boardId, draggedCardId, this.boardModel, session);

			if (pullResult.modifiedCount !== 1) throw Error(CARD_NOT_REMOVED);

			const cardGroup = await this.cardService.getCardFromBoard(boardId, cardId);

			if (!cardGroup) throw Error(CARD_NOT_FOUND);

			const { items, comments, votes } = cardToMove;
			const newItems = cardGroup.items.concat(items);

			const newVotes = (cardGroup.votes as unknown as string[]).concat(
				votes as unknown as string[]
			);

			const newComments = cardGroup.comments.concat(comments);

			const setResult = await this.boardModel
				.findOneAndUpdate(
					{
						_id: boardId,
						'columns.cards._id': cardId
					},
					{
						$set: {
							'columns.$[].cards.$[c].items': newItems,
							'columns.$[].cards.$[c].votes': newVotes,
							'columns.$[].cards.$[c].comments': newComments
						}
					},
					{
						arrayFilters: [{ 'c._id': cardId }],
						new: true
					}
				)
				.lean()
				.session(session);

			if (!setResult) throw Error(UPDATE_FAILED);
			await session.commitTransaction();

			return setResult;
		} catch (e) {
			await session.abortTransaction();
		} finally {
			await session.endSession();
		}
		return null;
	}
}

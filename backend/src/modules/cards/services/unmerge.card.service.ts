import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	CARD_NOT_FOUND,
	CARD_NOT_INSERTED,
	CARD_NOT_REMOVED,
	UPDATE_FAILED
} from 'src/libs/exceptions/messages';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import { GetCardService } from '../interfaces/services/get.card.service.interface';
import { UnmergeCardService } from '../interfaces/services/unmerge.card.service.interface';
import { TYPES } from '../interfaces/types';
import { pullItem } from '../shared/pull.card';
import { pushCardIntoPosition } from '../shared/push.card';

export class UnmergeCardServiceImpl implements UnmergeCardService {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@Inject(TYPES.services.GetCardService)
		private readonly cardService: GetCardService
	) {}

	async unmergeAndUpdatePosition(
		boardId: string,
		cardGroupId: string,
		draggedCardId: string,
		columnId: string,
		position: number
	) {
		const session = await this.boardModel.db.startSession();
		session.startTransaction();

		try {
			const cardItemToMove = await this.cardService.getCardItemFromGroup(boardId, draggedCardId);

			if (!cardItemToMove) return null;

			const pullResult = await pullItem(boardId, draggedCardId, this.boardModel, session);

			if (pullResult.modifiedCount !== 1) throw Error(CARD_NOT_REMOVED);

			const cardGroup = await this.cardService.getCardFromBoard(boardId, cardGroupId);

			if (!cardGroup) throw Error(CARD_NOT_FOUND);

			const items = cardGroup.items.filter((item) => item._id.toString() !== draggedCardId);

			if (items.length === 1) {
				const [{ text, comments, votes: itemVotes, createdBy, createdByTeam, anonymous }] = items;
				const newComments = cardGroup.comments.concat(comments);

				const newVotes = (cardGroup.votes as unknown as string[]).concat(
					itemVotes as unknown as string[]
				);

				const updateResult = await this.boardModel
					.findOneAndUpdate(
						{
							_id: boardId,
							'columns.cards._id': cardGroupId
						},
						{
							$set: {
								'columns.$.cards.$[c].text': text,
								'columns.$.cards.$[c].comments': [],
								'columns.$.cards.$[c].votes': [],
								'columns.$.cards.$[c].items.0.comments': newComments,
								'columns.$.cards.$[c].items.0.votes': newVotes,
								'columns.$.cards.$[c].createdBy': createdBy,
								'columns.$.cards.$[c].createdByTeam': createdByTeam,
								'columns.$.cards.$[c].anonymous': anonymous
							}
						},
						{
							arrayFilters: [{ 'c._id': cardGroupId }],
							session
						}
					)
					.lean()
					.exec();

				if (!updateResult) throw Error(UPDATE_FAILED);
			}

			const newCardItem = { ...cardItemToMove };
			delete newCardItem._id;

			const newCard = {
				...cardItemToMove,
				comments: [],
				votes: [],
				items: [newCardItem]
			};

			const pushResult = await pushCardIntoPosition(
				boardId,
				columnId,
				position,
				newCard,
				this.boardModel,
				session
			);

			if (!pushResult) throw Error(CARD_NOT_INSERTED);
			await session.commitTransaction();

			return pushResult;
		} catch (e) {
			await session.abortTransaction();
		} finally {
			await session.endSession();
		}

		return null;
	}
}

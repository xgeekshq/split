import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, LeanDocument, Model, ObjectId } from 'mongoose';

import { UPDATE_FAILED } from 'libs/exceptions/messages';
import Board, { BoardDocument } from 'modules/boards/schemas/board.schema';
import { CommentDocument } from 'modules/comments/schemas/comment.schema';
import User from 'modules/users/schemas/user.schema';
import { DeleteVoteService } from 'modules/votes/interfaces/services/delete.vote.service.interface';
import * as Votes from 'modules/votes/interfaces/types';

import { DeleteCardService } from '../interfaces/services/delete.card.service.interface';
import { GetCardService } from '../interfaces/services/get.card.service.interface';
import { TYPES } from '../interfaces/types';
import { CardItemDocument } from '../schemas/card.item.schema';
import { CardDocument } from '../schemas/card.schema';

@Injectable()
export default class DeleteCardServiceImpl implements DeleteCardService {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@Inject(TYPES.services.GetCardService)
		private getCardService: GetCardService,
		@Inject(Votes.TYPES.services.DeleteVoteService)
		private deleteVoteService: DeleteVoteService
	) {}

	async countDeletedVotes(
		boardId: string,
		cardId: string,
		userId: string,
		session: ClientSession,
		cardItemId?: string
	) {
		let getCard: LeanDocument<CardDocument | CardItemDocument> | null;

		/**
		 * If have cardItemId, use card item method,
		 * if not, use card method
		 */
		if (cardItemId) {
			// Card Item
			getCard = await this.getCardService.getCardItemFromGroup(boardId, cardItemId);
		} else {
			// Card
			getCard = await this.getCardService.getCardFromBoard(boardId, cardId);
		}

		if (getCard) {
			const countVotes = getCard?.votes?.length ?? 0;

			if (countVotes) {
				getCard.votes.forEach(async (current) => {
					const boardUser = await this.deleteVoteService.decrementVoteUser(
						boardId,
						current,
						session
					);

					if (!boardUser) throw Error(UPDATE_FAILED);
				});
			}

			/**
			 * If have items, getCard is a CardDocument (not a CardItemDocument)
			 */
			if (
				Object.hasOwn(getCard, 'items') &&
				(getCard as LeanDocument<CardDocument>).items.length > 0
			) {
				(getCard as LeanDocument<CardDocument>).items.forEach(async (current) => {
					current.votes.forEach(async (currentVote) => {
						const boardUser = await this.deleteVoteService.decrementVoteUser(
							boardId,
							currentVote,
							session
						);

						if (!boardUser) throw Error(UPDATE_FAILED);
					});
				});
			}
		} else {
			/**
			 * If getCard is null returns UPDATE_FAILED
			 */
			throw Error(UPDATE_FAILED);
		}
	}

	async delete(boardId: string, cardId: string, userId: string) {
		const session = await this.boardModel.db.startSession();
		session.startTransaction();
		try {
			await this.countDeletedVotes(boardId, cardId, userId, session);
			const board = await this.boardModel
				.findOneAndUpdate(
					{
						_id: boardId,
						'columns.cards._id': cardId
					},
					{
						$pull: {
							'columns.$[].cards': { _id: cardId, createdBy: userId }
						}
					},
					{ new: true }
				)
				.lean()
				.exec();
			if (!board) throw Error(UPDATE_FAILED);
			await session.commitTransaction();
			return board;
		} catch (e) {
			await session.abortTransaction();
		} finally {
			await session.endSession();
		}
		return null;
	}

	async refactorLastItem(
		boardId: string,
		cardId: string,
		newVotes: (LeanDocument<User> | LeanDocument<ObjectId>)[],
		newComments: LeanDocument<CommentDocument>[],
		cardItems: LeanDocument<CardItemDocument>[],
		session: ClientSession
	) {
		const board = await this.boardModel
			.findOneAndUpdate(
				{
					_id: boardId,
					'columns.cards._id': cardId
				},
				{
					$set: {
						'columns.$.cards.$[card].items.$[cardItem].votes': newVotes,
						'columns.$.cards.$[card].votes': [],
						'columns.$.cards.$[card].items.$[cardItem].comments': newComments,
						'columns.$.cards.$[card].comments': []
					}
				},
				{
					arrayFilters: [{ 'card._id': cardId }, { 'cardItem._id': cardItems[0]._id }],
					new: true
				}
			)
			.session(session)
			.lean()
			.exec();
		if (!board) throw Error(UPDATE_FAILED);
	}

	async deleteFromCardGroup(boardId: string, cardId: string, cardItemId: string, userId: string) {
		const session = await this.boardModel.db.startSession();
		session.startTransaction();
		try {
			await this.countDeletedVotes(boardId, cardId, userId, session, cardItemId);

			const card = await this.getCardService.getCardFromBoard(boardId, cardId);
			const cardItems = card?.items.filter((item) => item._id.toString() !== cardItemId);
			if (card && cardItems?.length === 1 && (card.votes.length > 0 || card.comments.length > 0)) {
				const newVotes = [...card.votes, ...cardItems[0].votes];
				const newComments = [...card.comments, ...cardItems[0].comments];
				await this.refactorLastItem(boardId, cardId, newVotes, newComments, cardItems, session);
			}

			const board = await this.boardModel
				.findOneAndUpdate(
					{
						_id: boardId,
						'columns.cards._id': cardId
					},
					{
						$pull: {
							'columns.$.cards.$[card].items': {
								_id: cardItemId,
								createdBy: userId
							}
						}
					},
					{ arrayFilters: [{ 'card._id': cardId }], new: true }
				)
				.lean()
				.exec();
			if (!board) throw Error(UPDATE_FAILED);
			await session.commitTransaction();
			return board;
		} catch (e) {
			await session.abortTransaction();
		} finally {
			await session.endSession();
		}
		return null;
	}
}

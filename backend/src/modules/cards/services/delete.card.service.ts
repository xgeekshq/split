import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { BoardDataPopulate } from 'src/modules/boards/utils/populate-board';
import Comment from 'src/modules/comments/schemas/comment.schema';
import User from 'src/modules/users/entities/user.schema';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import * as Votes from 'src/modules/votes/interfaces/types';
import { DeleteCardService } from '../interfaces/services/delete.card.service.interface';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import { TYPES } from '../interfaces/types';
import CardItem from '../schemas/card.item.schema';
import Card from '../schemas/card.schema';

@Injectable()
export default class DeleteCardServiceImpl implements DeleteCardService {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@Inject(TYPES.services.GetCardService)
		private getCardService: GetCardServiceInterface,
		@Inject(Votes.TYPES.services.DeleteVoteService)
		private deleteVoteService: DeleteVoteServiceInterface
	) {}

	async deletedVotesFromCardItem(boardId: string, cardItemId: string) {
		const getCardItem = await this.getCardService.getCardItemFromGroup(boardId, cardItemId);

		if (!getCardItem) {
			throw Error(UPDATE_FAILED);
		}

		if (getCardItem.votes?.length) {
			const promises = getCardItem.votes.map((voteUserId) => {
				return this.deleteVoteService.decrementVoteUser(boardId, voteUserId);
			});
			const results = await Promise.all(promises);

			if (results.some((i) => i === null)) {
				throw Error(UPDATE_FAILED);
			}
		}
	}

	async deletedVotesFromCard(boardId: string, cardId: string) {
		const getCard = await this.getCardService.getCardFromBoard(boardId, cardId);

		if (!getCard) {
			throw Error(UPDATE_FAILED);
		}

		if (getCard.votes?.length) {
			const promises = getCard.votes.map((voteUserId) => {
				return this.deleteVoteService.decrementVoteUser(boardId, voteUserId);
			});
			const results = await Promise.all(promises);

			if (results.some((i) => i === null)) {
				throw Error(UPDATE_FAILED);
			}
		}

		if (Array.isArray(getCard.items)) {
			const promises = [];
			getCard.items.forEach(async (current) => {
				current.votes.forEach(async (currentVote) => {
					promises.push(this.deleteVoteService.decrementVoteUser(boardId, currentVote));
				});
			});
			const results = await Promise.all(promises);

			if (results.some((i) => i === null)) {
				throw Error(UPDATE_FAILED);
			}
		}
	}

	async delete(boardId: string, cardId: string, userId: string) {
		const session = await this.boardModel.db.startSession();
		session.startTransaction();
		try {
			await this.deletedVotesFromCard(boardId, cardId);
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
				.populate(BoardDataPopulate)
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
		newVotes: (User | ObjectId | string)[],
		newComments: Comment[],
		cardItems: CardItem[]
	) {
		const [{ text, createdBy }] = cardItems;

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
						'columns.$.cards.$[card].comments': [],
						'columns.$.cards.$[card].text': text,
						'columns.$.cards.$[card].createdBy': createdBy
					}
				},
				{
					arrayFilters: [{ 'card._id': cardId }, { 'cardItem._id': cardItems[0]._id }],
					new: true
				}
			)
			.lean()
			.exec();

		if (!board) throw Error(UPDATE_FAILED);
	}

	async deleteFromCardGroup(boardId: string, cardId: string, cardItemId: string, userId: string) {
		const session = await this.boardModel.db.startSession();
		session.startTransaction();
		try {
			await this.deletedVotesFromCardItem(boardId, cardItemId);
			const card = await this.getCardService.getCardFromBoard(boardId, cardId);
			const cardItems = card?.items.filter((item) => item._id.toString() !== cardItemId);

			if (
				card &&
				cardItems?.length === 1 &&
				(card.votes.length >= 0 || card.comments.length >= 0)
			) {
				const newVotes = [...card.votes, ...cardItems[0].votes];
				const newComments = [...card.comments, ...cardItems[0].comments];
				await this.refactorLastItem(boardId, cardId, newVotes, newComments, cardItems);
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
				.populate(BoardDataPopulate)
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

	async deleteCardVotesFromColumn(boardId: string, cards: Card[]) {
		cards.forEach((cards) => {
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
					await this.deleteVoteService.decrementVoteUser(boardId, userId, -votesCount);
				});
			});
		});
	}
}

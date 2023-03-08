import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import Comment from 'src/modules/comments/schemas/comment.schema';
import User from 'src/modules/users/entities/user.schema';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import * as Votes from 'src/modules/votes/interfaces/types';
import { DeleteCardServiceInterface } from '../interfaces/services/delete.card.service.interface';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import { TYPES } from '../interfaces/types';
import CardItem from '../entities/card.item.schema';
import Card from '../entities/card.schema';
import { CardRepositoryInterface } from '../repository/card.repository.interface';

@Injectable()
export default class DeleteCardService implements DeleteCardServiceInterface {
	constructor(
		@Inject(TYPES.services.GetCardService)
		private getCardService: GetCardServiceInterface,
		@Inject(Votes.TYPES.services.DeleteVoteService)
		private deleteVoteService: DeleteVoteServiceInterface,
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	async delete(boardId: string, cardId: string) {
		await this.cardRepository.startTransaction();
		try {
			await this.deletedVotesFromCard(boardId, cardId);
			const boardWithCardsDeleted = await this.cardRepository.updateCardsFromBoard(boardId, cardId);

			if (!boardWithCardsDeleted) throw Error(UPDATE_FAILED);
			await this.cardRepository.commitTransaction();

			return boardWithCardsDeleted;
		} catch (e) {
			await this.cardRepository.abortTransaction();
		} finally {
			await this.cardRepository.endSession();
		}

		return null;
	}

	async deleteFromCardGroup(boardId: string, cardId: string, cardItemId: string) {
		this.cardRepository.startTransaction();
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
			const boardUpdated = await this.cardRepository.deleteCardFromCardItems(
				boardId,
				cardId,
				cardItemId
			);

			if (!boardUpdated) throw Error(UPDATE_FAILED);
			await this.cardRepository.commitTransaction();

			return boardUpdated;
		} catch (e) {
			await this.cardRepository.abortTransaction();
		} finally {
			await this.cardRepository.endSession();
		}

		return null;
	}

	async deleteCardVotesFromColumn(boardId: string, cardsArray: Card[]) {
		cardsArray.forEach((cards) => {
			cards.items.forEach(async (card) => {
				const votesByUserOnCardItems = this.getVotesByUser(card.votes);

				votesByUserOnCardItems.forEach(async (votesCount, userId) => {
					await this.deleteVoteService.decrementVoteUser(boardId, userId, -votesCount);
				});
			});

			if (cards.votes.length > 0) {
				const votesByUserOnCard = this.getVotesByUser(cards.votes);
				votesByUserOnCard.forEach(async (votesCount, userId) => {
					await this.deleteVoteService.decrementVoteUser(boardId, userId, -votesCount);
				});
			}
		});
	}

	/* HELPERS */

	private getVotesByUser(votes: string[] | User[] | ObjectId[]): Map<string, number> {
		const votesByUser = new Map<string, number>();

		votes.forEach((userId) => {
			if (!votesByUser.has(userId.toString())) {
				votesByUser.set(userId.toString(), 1);
			} else {
				const count = votesByUser.get(userId.toString());
				votesByUser.set(userId.toString(), count + 1);
			}
		});

		return votesByUser;
	}

	private async refactorLastItem(
		boardId: string,
		cardId: string,
		newVotes: (User | ObjectId | string)[],
		newComments: Comment[],
		cardItems: CardItem[]
	) {
		const boardWithLastCardRefactored = await this.cardRepository.refactorLastCardItem(
			boardId,
			cardId,
			newVotes,
			newComments,
			cardItems
		);

		if (!boardWithLastCardRefactored) throw Error(UPDATE_FAILED);
	}

	private async deletedVotesFromCardItem(boardId: string, cardItemId: string) {
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

	private async deletedVotesFromCard(boardId: string, cardId: string) {
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
}

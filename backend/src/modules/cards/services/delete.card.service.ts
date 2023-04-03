import { Inject, Injectable } from '@nestjs/common';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import * as Votes from 'src/modules/votes/interfaces/types';
import { DeleteCardServiceInterface } from '../interfaces/services/delete.card.service.interface';
import Card from '../entities/card.schema';
import { getUserWithVotes } from '../utils/get-user-with-votes';

@Injectable()
export default class DeleteCardService implements DeleteCardServiceInterface {
	constructor(
		@Inject(Votes.TYPES.services.DeleteVoteService)
		private deleteVoteService: DeleteVoteServiceInterface
	) {}

	async deleteCardVotesFromColumn(boardId: string, cardsArray: Card[]) {
		cardsArray.forEach((cards) => {
			cards.items.forEach(async (card) => {
				const votesByUserOnCardItems = getUserWithVotes(card.votes);

				votesByUserOnCardItems.forEach(async (votesCount, userId) => {
					await this.deleteVoteService.decrementVoteUser(boardId, userId, -votesCount);
				});
			});

			if (cards.votes.length > 0) {
				const votesByUserOnCard = getUserWithVotes(cards.votes);
				votesByUserOnCard.forEach(async (votesCount, userId) => {
					await this.deleteVoteService.decrementVoteUser(boardId, userId, -votesCount);
				});
			}
		});
	}
}

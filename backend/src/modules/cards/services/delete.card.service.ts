import { Inject, Injectable } from '@nestjs/common';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import * as Votes from 'src/modules/votes/interfaces/types';
import { DeleteCardServiceInterface } from '../interfaces/services/delete.card.service.interface';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import { TYPES } from '../interfaces/types';
import Card from '../entities/card.schema';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import { getUserWithVotes } from '../utils/get-user-with-votes';

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

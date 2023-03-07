import { Inject, Injectable } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import * as Cards from 'src/modules/cards/interfaces/types';
import { CardRepositoryInterface } from '../repository/card.repository.interface';

@Injectable()
export default class GetCardService implements GetCardServiceInterface {
	constructor(
		@Inject(Cards.TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	async getCardFromBoard(boardId: string, cardId: string) {
		const result = await this.cardRepository.getCardFromBoard(boardId, cardId);

		return !isEmpty(result) ? result[0] : null;
	}

	async getCardItemFromGroup(boardId: string, cardItemId: string) {
		const result = await this.cardRepository.getCardItemFromGroup(boardId, cardItemId);

		return !isEmpty(result) ? result[0] : null;
	}
}

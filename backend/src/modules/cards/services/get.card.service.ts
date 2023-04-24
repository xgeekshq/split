import { Inject, Injectable } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import { CARD_REPOSITORY } from 'src/modules/cards/constants';

@Injectable()
export default class GetCardService implements GetCardServiceInterface {
	constructor(
		@Inject(CARD_REPOSITORY)
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

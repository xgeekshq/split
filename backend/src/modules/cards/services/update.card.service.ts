import { Inject, Injectable } from '@nestjs/common';
import { CARD_NOT_INSERTED, CARD_NOT_REMOVED } from 'src/libs/exceptions/messages';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import { UpdateCardServiceInterface } from '../interfaces/services/update.card.service.interface';
import * as Cards from 'src/modules/cards/interfaces/types';
import { CardRepositoryInterface } from '../repository/card.repository.interface';

@Injectable()
export default class UpdateCardServiceImpl implements UpdateCardServiceInterface {
	constructor(
		@Inject(Cards.TYPES.services.GetCardService)
		private readonly cardService: GetCardServiceInterface,
		@Inject(Cards.TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	async updateCardPosition(
		boardId: string,
		cardId: string,
		targetColumnId: string,
		newPosition: number
	) {
		await this.cardRepository.startTransaction();

		try {
			const cardToMove = await this.cardService.getCardFromBoard(boardId, cardId);

			if (!cardToMove) return null;

			const pullResult = await this.cardRepository.pullCard(boardId, cardId, true);

			if (pullResult.modifiedCount !== 1) throw Error(CARD_NOT_REMOVED);

			const pushResult = await this.cardRepository.pushCard(
				boardId,
				targetColumnId,
				newPosition,
				cardToMove,
				true
			);

			if (!pushResult) throw Error(CARD_NOT_INSERTED);

			await this.cardRepository.commitTransaction();
		} catch (e) {
			await this.cardRepository.abortTransaction();
		} finally {
			await this.cardRepository.endSession();
		}
	}

	updateCardText(
		boardId: string,
		cardId: string,
		cardItemId: string,
		userId: string,
		text: string
	) {
		return this.cardRepository.updateCardText(boardId, cardId, cardItemId, userId, text);
	}

	updateCardGroupText(boardId: string, cardId: string, userId: string, text: string) {
		return this.cardRepository.updateCardGroupText(boardId, cardId, userId, text);
	}

	pullCardItem(boardId: string, itemId: string, session?: boolean) {
		return this.cardRepository.pullItem(boardId, itemId, session);
	}
}

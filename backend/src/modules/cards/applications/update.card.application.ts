import { Inject, Injectable } from '@nestjs/common';
import { UpdateCardApplication } from '../interfaces/applications/update.card.application.interface';
import { UpdateCardServiceInterface } from '../interfaces/services/update.card.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class UpdateCardApplicationImpl implements UpdateCardApplication {
	constructor(
		@Inject(TYPES.services.UpdateCardService)
		private updateCardService: UpdateCardServiceInterface
	) {}

	updateCardPosition(boardId: string, cardId: string, targetColumnId: string, newPosition: number) {
		return this.updateCardService.updateCardPosition(boardId, cardId, targetColumnId, newPosition);
	}

	updateCardText(
		boardId: string,
		cardId: string,
		cardItemId: string,
		userId: string,
		text: string
	) {
		return this.updateCardService.updateCardText(boardId, cardId, cardItemId, userId, text);
	}

	updateCardGroupText(boardId: string, cardId: string, userId: string, text: string) {
		return this.updateCardService.updateCardGroupText(boardId, cardId, userId, text);
	}
}

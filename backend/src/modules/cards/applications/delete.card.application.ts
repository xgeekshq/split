import { Inject, Injectable } from '@nestjs/common';
import { DeleteCardApplicationInterface } from '../interfaces/applications/delete.card.application.interface';
import { DeleteCardServiceInterface } from '../interfaces/services/delete.card.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DeleteCardApplication implements DeleteCardApplicationInterface {
	constructor(
		@Inject(TYPES.services.DeleteCardService)
		private deleteCardService: DeleteCardServiceInterface
	) {}

	delete(boardId: string, cardId: string) {
		return this.deleteCardService.delete(boardId, cardId);
	}

	deleteFromCardGroup(boardId: string, cardId: string, cardItemId: string) {
		return this.deleteCardService.deleteFromCardGroup(boardId, cardId, cardItemId);
	}
}

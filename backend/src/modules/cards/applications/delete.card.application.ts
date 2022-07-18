import { Inject, Injectable } from '@nestjs/common';

import { DeleteCardApplication } from '../interfaces/applications/delete.card.application.interface';
import { DeleteCardService } from '../interfaces/services/delete.card.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DeleteCardApplicationImpl implements DeleteCardApplication {
	constructor(
		@Inject(TYPES.services.DeleteCardService)
		private deleteCardService: DeleteCardService
	) {}

	delete(boardId: string, cardId: string, userId: string) {
		return this.deleteCardService.delete(boardId, cardId, userId);
	}

	deleteFromCardGroup(boardId: string, cardId: string, cardItemId: string, userId: string) {
		return this.deleteCardService.deleteFromCardGroup(boardId, cardId, cardItemId, userId);
	}
}

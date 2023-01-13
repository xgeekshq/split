import { Inject, Injectable } from '@nestjs/common';
import { MergeCardApplication } from '../interfaces/applications/merge.card.application.interface';
import { MergeCardService } from '../interfaces/services/merge.card.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class MergeCardApplicationImpl implements MergeCardApplication {
	constructor(
		@Inject(TYPES.services.MergeCardService)
		private mergeCardService: MergeCardService
	) {}

	mergeCards(boardId: string, draggedCardId: string, cardId: string, userId: string) {
		return this.mergeCardService.mergeCards(boardId, draggedCardId, cardId, userId);
	}
}

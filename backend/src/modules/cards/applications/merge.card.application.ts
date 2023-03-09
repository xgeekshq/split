import { Inject, Injectable } from '@nestjs/common';
import { MergeCardApplicationInterface } from '../interfaces/applications/merge.card.application.interface';
import { MergeCardServiceInterface } from '../interfaces/services/merge.card.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class MergeCardApplication implements MergeCardApplicationInterface {
	constructor(
		@Inject(TYPES.services.MergeCardService)
		private mergeCardService: MergeCardServiceInterface
	) {}

	mergeCards(boardId: string, draggedCardId: string, cardId: string) {
		return this.mergeCardService.mergeCards(boardId, draggedCardId, cardId);
	}
}

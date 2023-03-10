import { Inject, Injectable } from '@nestjs/common';
import { UnmergeCardApplicationInterface } from '../interfaces/applications/unmerge.card.application.interface';
import { UnmergeCardServiceInterface } from '../interfaces/services/unmerge.card.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class UnmergeCardApplication implements UnmergeCardApplicationInterface {
	constructor(
		@Inject(TYPES.services.UnmergeCardService)
		private unmergeCardService: UnmergeCardServiceInterface
	) {}

	unmergeAndUpdatePosition(
		boardId: string,
		cardGroupId: string,
		draggedCardId: string,
		columnId: string,
		position: number
	) {
		return this.unmergeCardService.unmergeAndUpdatePosition(
			boardId,
			cardGroupId,
			draggedCardId,
			columnId,
			position
		);
	}
}

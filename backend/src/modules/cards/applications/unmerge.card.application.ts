import { Inject, Injectable } from '@nestjs/common';
import { UnmergeCardApplication } from '../interfaces/applications/unmerge.card.application.interface';
import { UnmergeCardService } from '../interfaces/services/unmerge.card.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class UnmergeCardApplicationImpl implements UnmergeCardApplication {
	constructor(
		@Inject(TYPES.services.UnmergeCardService)
		private unmergeCardService: UnmergeCardService
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

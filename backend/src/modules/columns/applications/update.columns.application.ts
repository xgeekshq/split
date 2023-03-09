import { Inject, Injectable } from '@nestjs/common';
import { ColumnDeleteCardsDto } from '../dto/colum.deleteCards.dto';
import { UpdateColumnDto } from '../dto/update-column.dto';
import { UpdateColumnApplicationInterface } from '../interfaces/applications/update.comment.application.interface';
import { UpdateColumnServiceInterface } from '../interfaces/services/update.column.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class UpdateColumnApplication implements UpdateColumnApplicationInterface {
	constructor(
		@Inject(TYPES.services.UpdateColumnService)
		private updateColumnService: UpdateColumnServiceInterface
	) {}

	updateColumn(boardId: string, column: UpdateColumnDto) {
		return this.updateColumnService.updateColumn(boardId, column);
	}

	deleteCardsFromColumn(boardId: string, column: ColumnDeleteCardsDto) {
		return this.updateColumnService.deleteCardsFromColumn(boardId, column);
	}
}

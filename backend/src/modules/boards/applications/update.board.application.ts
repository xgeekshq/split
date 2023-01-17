import { Inject, Injectable } from '@nestjs/common';
import { UpdateColumnDto } from '../dto/column/update-column.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { UpdateBoardApplicationInterface } from '../interfaces/applications/update.board.application.interface';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class UpdateBoardApplication implements UpdateBoardApplicationInterface {
	constructor(
		@Inject(TYPES.services.UpdateBoardService)
		private updateBoardService: UpdateBoardServiceInterface
	) {}

	update(boardId: string, boardData: UpdateBoardDto) {
		return this.updateBoardService.update(boardId, boardData);
	}

	mergeBoards(subBoardId: string, userId: string) {
		return this.updateBoardService.mergeBoards(subBoardId, userId);
	}

	updateColumn(boardId: string, column: UpdateColumnDto) {
		return this.updateBoardService.updateColumn(boardId, column);
	}
}

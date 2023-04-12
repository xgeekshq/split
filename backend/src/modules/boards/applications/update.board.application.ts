import { Inject, Injectable } from '@nestjs/common';
import { UpdateBoardApplicationInterface } from '../interfaces/applications/update.board.application.interface';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import { TYPES } from '../interfaces/types';
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';

@Injectable()
export class UpdateBoardApplication implements UpdateBoardApplicationInterface {
	constructor(
		@Inject(TYPES.services.UpdateBoardService)
		private updateBoardService: UpdateBoardServiceInterface
	) {}

	mergeBoards(subBoardId: string, userId: string, socketId?: string) {
		return this.updateBoardService.mergeBoards(subBoardId, userId, socketId);
	}

	updatePhase(payload: BoardPhaseDto) {
		this.updateBoardService.updatePhase(payload);
	}
}

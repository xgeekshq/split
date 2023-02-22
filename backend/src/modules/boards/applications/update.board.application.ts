import { Inject, Injectable } from '@nestjs/common';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { UpdateBoardApplicationInterface } from '../interfaces/applications/update.board.application.interface';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import { TYPES } from '../interfaces/types';
import UpdateBoardUserDto from '../dto/update-board-user.dto';
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';

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

	updateBoardParticipants(boardData: UpdateBoardUserDto) {
		const { addBoardUsers, removeBoardUsers, boardUserToUpdateRole } = boardData;

		if (boardUserToUpdateRole) {
			return this.updateBoardService.updateBoardParticipantsRole(boardUserToUpdateRole);
		}

		return this.updateBoardService.updateBoardParticipants(addBoardUsers, removeBoardUsers);
	}

	updateVotingPhase(payload: BoardPhaseDto) {
		this.updateBoardService.updateVotingPhase(payload);
	}
}

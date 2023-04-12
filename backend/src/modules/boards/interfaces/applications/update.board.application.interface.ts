import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';

export interface UpdateBoardApplicationInterface {
	updatePhase(payload: BoardPhaseDto);
}

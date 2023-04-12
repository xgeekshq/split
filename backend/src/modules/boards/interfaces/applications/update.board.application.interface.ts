import { LeanDocument } from 'mongoose';
import Board from '../../entities/board.schema';
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';

export interface UpdateBoardApplicationInterface {
	mergeBoards(
		subBoardId: string,
		userId: string,
		socketId?: string
	): Promise<LeanDocument<Board> | null>;

	// updateBoardParticipants(boardData: UpdateBoardUserDto): Promise<BoardUser[] | BoardUser | null>;

	updatePhase(payload: BoardPhaseDto);
}

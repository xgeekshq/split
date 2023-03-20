import { LeanDocument } from 'mongoose';
import { UpdateBoardDto } from '../../dto/update-board.dto';
import Board, { BoardDocument } from '../../entities/board.schema';
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';
import UpdateBoardUserDto from 'src/modules/boardUsers/dto/update-board-user.dto';
import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';

export interface UpdateBoardApplicationInterface {
	update(boardId: string, boardData: UpdateBoardDto): Promise<Board>;

	mergeBoards(
		subBoardId: string,
		userId: string,
		socketId?: string
	): Promise<LeanDocument<BoardDocument> | null>;

	updateBoardParticipants(boardData: UpdateBoardUserDto): Promise<BoardUser[] | BoardUser | null>;

	updatePhase(payload: BoardPhaseDto);
}

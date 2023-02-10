import BoardUserDto from 'src/modules/boards/dto/board.user.dto';
import { LeanDocument } from 'mongoose';
import { UpdateBoardDto } from '../../dto/update-board.dto';
import { BoardDocument } from '../../entities/board.schema';
import BoardUser from '../../entities/board.user.schema';

export interface UpdateBoardApplicationInterface {
	update(boardId: string, boardData: UpdateBoardDto): Promise<LeanDocument<BoardDocument> | null>;

	mergeBoards(subBoardId: string, userId: string): Promise<LeanDocument<BoardDocument> | null>;

	updateBoardParticipants(
		addUsers: BoardUserDto[],
		removeUsers: string[]
	): Promise<BoardUser[] | null>;
}

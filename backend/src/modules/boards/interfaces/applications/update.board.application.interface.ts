import { LeanDocument } from 'mongoose';
import { UpdateBoardDto } from '../../dto/update-board.dto';
import { BoardDocument } from '../../entities/board.schema';

export interface UpdateBoardApplicationInterface {
	update(boardId: string, boardData: UpdateBoardDto): Promise<LeanDocument<BoardDocument> | null>;

	mergeBoards(subBoardId: string, userId: string): Promise<LeanDocument<BoardDocument> | null>;
}

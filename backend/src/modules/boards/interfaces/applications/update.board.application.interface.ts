import { LeanDocument } from 'mongoose';
import { UpdateColumnDto } from '../../dto/column/update-column.dto';
import { UpdateBoardDto } from '../../dto/update-board.dto';
import { BoardDocument } from '../../schemas/board.schema';

export interface UpdateBoardApplicationInterface {
	update(boardId: string, boardData: UpdateBoardDto): Promise<LeanDocument<BoardDocument> | null>;

	mergeBoards(subBoardId: string, userId: string): Promise<LeanDocument<BoardDocument> | null>;
	updateColumn(
		boardId: string,
		column: UpdateColumnDto
	): Promise<LeanDocument<BoardDocument> | null>;
}

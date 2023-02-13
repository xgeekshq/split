import BoardUser from './../../schemas/board.user.schema';
import { LeanDocument } from 'mongoose';
import { ColumnDeleteCardsDto } from 'src/libs/dto/colum.deleteCards.dto';
import { UpdateColumnDto } from '../../dto/column/update-column.dto';
import { UpdateBoardDto } from '../../dto/update-board.dto';
import { BoardDocument } from '../../schemas/board.schema';
import UpdateBoardUserDto from '../../dto/update-board-user.dto';

export interface UpdateBoardApplicationInterface {
	update(boardId: string, boardData: UpdateBoardDto): Promise<LeanDocument<BoardDocument> | null>;

	mergeBoards(subBoardId: string, userId: string): Promise<LeanDocument<BoardDocument> | null>;

	updateColumn(
		boardId: string,
		column: UpdateColumnDto
	): Promise<LeanDocument<BoardDocument> | null>;

	deleteCardsFromColumn(
		boardId: string,
		column: ColumnDeleteCardsDto
	): Promise<LeanDocument<BoardDocument> | null>;

	updateBoardParticipants(boardData: UpdateBoardUserDto): Promise<BoardUser[] | BoardUser | null>;
}

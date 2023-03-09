import { LeanDocument } from 'mongoose';
import { ColumnDeleteCardsDto } from 'src/modules/columns/dto/colum.deleteCards.dto';
import { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { UpdateColumnDto } from '../../dto/update-column.dto';

export interface UpdateColumnServiceInterface {
	updateColumn(
		boardId: string,
		column: UpdateColumnDto
	): Promise<LeanDocument<BoardDocument> | null>;

	deleteCardsFromColumn(
		boardId: string,
		column: ColumnDeleteCardsDto
	): Promise<LeanDocument<BoardDocument> | null>;
}

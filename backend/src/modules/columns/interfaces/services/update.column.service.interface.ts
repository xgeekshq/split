import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { DeleteCardsFromColumnDto } from 'src/modules/columns/dto/delete-cards-from-column.dto';

export interface UpdateColumnServiceInterface {
	deleteCardsFromColumn(
		boardId: string,
		column: DeleteCardsFromColumnDto
	): Promise<LeanDocument<BoardDocument> | null>;
}

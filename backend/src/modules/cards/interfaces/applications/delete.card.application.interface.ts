import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/entities/board.schema';

export interface DeleteCardApplicationInterface {
	delete(boardId: string, cardId: string): Promise<LeanDocument<BoardDocument> | null>;

	deleteFromCardGroup(
		boardId: string,
		cardId: string,
		cardItemId: string
	): Promise<LeanDocument<BoardDocument> | null>;
}

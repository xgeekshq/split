import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/schemas/board.schema';

export interface DeleteCardService {
	delete(boardId: string, cardId: string): Promise<LeanDocument<BoardDocument> | null>;

	deleteFromCardGroup(
		boardId: string,
		cardId: string,
		cardItemId: string
	): Promise<LeanDocument<BoardDocument> | null>;
}

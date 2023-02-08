import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/entities/board.schema';

export interface DeleteCardApplication {
	delete(
		boardId: string,
		cardId: string,
		userId: string
	): Promise<LeanDocument<BoardDocument> | null>;

	deleteFromCardGroup(
		boardId: string,
		cardId: string,
		cardItemId: string,
		userId: string
	): Promise<LeanDocument<BoardDocument> | null>;
}

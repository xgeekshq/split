import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/schemas/board.schema';

export interface UpdateCardService {
	updateCardPosition(
		boardId: string,
		cardId: string,
		targetColumnId: string,
		newPosition: number
	): Promise<void>;

	updateCardText(
		boardId: string,
		cardId: string,
		cardItemId: string,
		userId: string,
		text: string
	): Promise<LeanDocument<BoardDocument>>;

	updateCardGroupText(
		boardId: string,
		cardId: string,
		userId: string,
		text: string
	): Promise<LeanDocument<BoardDocument>>;
}

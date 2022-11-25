import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/schemas/board.schema';

export interface CreateCommentApplication {
	createItemComment(
		boardId: string,
		cardId: string,
		itemId: string,
		userId: string,
		text: string,
		anonymous: boolean
	): Promise<LeanDocument<BoardDocument> | null>;

	createCardGroupComment(
		boardId: string,
		cardId: string,
		userId: string,
		text: string,
		anonymous: boolean
	): Promise<LeanDocument<BoardDocument> | null>;
}

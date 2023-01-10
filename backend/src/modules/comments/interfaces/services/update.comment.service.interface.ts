import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/schemas/board.schema';

export interface UpdateCommentService {
	updateItemComment(
		boardId: string,
		cardId: string,
		cardItemId: string,
		commentId: string,
		userId: string,
		text: string,
		anonymous: boolean
	): Promise<LeanDocument<BoardDocument> | null>;

	updateCardGroupComment(
		boardId: string,
		cardId: string,
		commentId: string,
		userId: string,
		text: string,
		anonymous: boolean
	): Promise<LeanDocument<BoardDocument> | null>;
}

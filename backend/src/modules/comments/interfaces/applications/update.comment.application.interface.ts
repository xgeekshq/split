import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/entities/board.schema';

export interface UpdateCommentApplicationInterface {
	updateItemComment(
		boardId: string,
		cardId: string,
		cardItemId: string,
		commentId: string,
		text: string,
		anonymous: boolean
	): Promise<LeanDocument<BoardDocument> | null>;

	updateCardGroupComment(
		boardId: string,
		cardId: string,
		commentId: string,
		text: string,
		anonymous: boolean
	): Promise<LeanDocument<BoardDocument> | null>;
}

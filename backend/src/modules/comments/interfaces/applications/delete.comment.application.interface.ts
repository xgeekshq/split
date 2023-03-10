import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/entities/board.schema';

export interface DeleteCommentApplicationInterface {
	deleteItemComment(
		boardId: string,
		commentId: string,
		userId: string
	): Promise<LeanDocument<BoardDocument>>;

	deleteCardGroupComment(
		boardId: string,
		commentId: string,
		userId: string
	): Promise<LeanDocument<BoardDocument>>;
}

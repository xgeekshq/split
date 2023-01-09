import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/schemas/board.schema';

export interface DeleteCommentService {
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

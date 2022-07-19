import { LeanDocument } from 'mongoose';

import { BoardDocument } from 'modules/boards/schemas/board.schema';

export interface DeleteCommentService {
	deleteItemComment(
		boardId: string,
		commentId: string,
		userId: string
	): Promise<LeanDocument<BoardDocument> | null>;

	deleteCardGroupComment(
		boardId: string,
		commentId: string,
		userId: string
	): Promise<LeanDocument<BoardDocument> | null>;
}

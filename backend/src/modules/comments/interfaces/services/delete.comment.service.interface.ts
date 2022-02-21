import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../../boards/schemas/board.schema';

export interface DeleteCommentService {
  deleteItemComment(
    boardId: string,
    commentId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}

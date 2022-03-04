import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../../boards/schemas/board.schema';

export interface UpdateCommentApplication {
  updateItemComment(
    boardId: string,
    cardId: string,
    cardItemId: string,
    commentId: string,
    userId: string,
    text: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
  updateCardGroupComment(
    boardId: string,
    cardId: string,
    commentId: string,
    userId: string,
    text: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}

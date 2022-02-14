import { BoardDocument } from '../../../boards/schemas/board.schema';

export interface DeleteCommentApplication {
  deleteItemComment(
    boardId: string,
    commentId: string,
    userId: string,
  ): Promise<BoardDocument>;
}

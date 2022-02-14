import { BoardDocument } from '../../../boards/schemas/board.schema';

export interface CreateCommentService {
  createItemComment(
    boardId: string,
    cardId: string,
    itemId: string,
    userId: string,
    text: string,
  ): Promise<BoardDocument>;
}

import { BoardDocument } from 'src/modules/boards/schemas/board.schema';

export interface UpdateCardService {
  updateCardPosition(
    boardId: string,
    cardId: string,
    targetColumnId: string,
    newPosition: number,
  ): Promise<BoardDocument>;
  updateCardText(
    boardId: string,
    cardId: string,
    cardItemId: string,
    userId: string,
    text: string,
  ): Promise<BoardDocument>;
}

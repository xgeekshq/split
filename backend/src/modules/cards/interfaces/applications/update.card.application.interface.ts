import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../../boards/schemas/board.schema';

export interface UpdateCardApplication {
  updateCardPosition(
    boardId: string,
    cardId: string,
    targetColumnId: string,
    newPosition: number,
  ): Promise<LeanDocument<BoardDocument> | null>;
  updateCardText(
    boardId: string,
    cardId: string,
    cardItemId: string,
    userId: string,
    text: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}

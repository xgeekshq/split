import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../../boards/schemas/board.schema';

export interface DeleteCardApplication {
  delete(
    boardId: string,
    cardId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
  deleteFromCardGroup(
    boardId: string,
    cardId: string,
    cardItemId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}

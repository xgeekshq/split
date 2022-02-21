import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../../boards/schemas/board.schema';

export interface DeleteCardService {
  delete(
    boardId: string,
    cardId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}

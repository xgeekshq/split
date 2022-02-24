import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../../boards/schemas/board.schema';

export interface CreateVoteApplication {
  addVoteToCard(
    boardId: string,
    cardId: string,
    userId: string,
    cardItemId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}

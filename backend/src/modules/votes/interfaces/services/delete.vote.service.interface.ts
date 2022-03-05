import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../../boards/schemas/board.schema';

export interface DeleteVoteService {
  deleteVoteFromCard(
    boardId: string,
    cardId: string,
    userId: string,
    cardItemId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
  deleteVoteFromCardGroup(
    boardId: string,
    cardId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}

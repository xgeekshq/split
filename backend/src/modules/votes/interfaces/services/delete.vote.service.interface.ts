import { LeanDocument, ClientSession } from 'mongoose';
import { BoardDocument } from '../../../boards/schemas/board.schema';
import { BoardUserDocument } from '../../../boards/schemas/board.user.schema';

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
  decrementVoteUser(
    boardId: string,
    userId: string,
    session: ClientSession,
    count?: number | undefined,
  ): Promise<LeanDocument<BoardUserDocument> | null>;
}

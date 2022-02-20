import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../schemas/board.schema';

export interface GetBoardApplication {
  getAllBoards(userId: string): Promise<LeanDocument<BoardDocument>[] | null>;
  getBoardWithEmail(
    boardId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}

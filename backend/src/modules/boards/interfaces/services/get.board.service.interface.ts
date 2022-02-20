import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../schemas/board.schema';

export interface GetBoardService {
  getAllBoards(userId: string): Promise<LeanDocument<BoardDocument>[] | null>;
  getBoardFromRepo(
    boardId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
  getBoardWithEmail(
    boardId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}

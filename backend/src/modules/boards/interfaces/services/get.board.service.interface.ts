import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../schemas/board.schema';

export interface GetBoardService {
  getAllBoards(userId: string): Promise<LeanDocument<BoardDocument>[] | null>;
  getBoardFromRepo(
    boardId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
  getBoard(
    boardId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}

import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../schemas/board.schema';

export interface GetBoardService {
  getBoards(
    option: 'dashboard' | 'allBoards' | 'myBoards',
    userId?: string,
    page?: number,
    size?: number,
  ): Promise<{
    boards: LeanDocument<BoardDocument>[];
    hasNextPage: boolean;
    page: number;
  } | null>;
  getBoardFromRepo(
    boardId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
  getBoard(
    boardId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
  countBoards(userId: string): Promise<number>;
}

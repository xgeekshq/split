import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../schemas/board.schema';

export interface GetBoardApplication {
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
  getBoard(
    boardId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
  countBoards(userId: string): Promise<number>;
}

import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../schemas/board.schema';
import { BoardsAndPage } from '../boards-page.interface';

export interface GetBoardServiceInterface {
  getUserBoardsOfLast3Months(
    userId: string,
    page?: number,
    size?: number,
  ): Promise<BoardsAndPage | null>;
  getSuperAdminBoards(
    userId: string,
    page?: number,
    size?: number,
  ): Promise<BoardsAndPage | null>;
  getUsersBoards(
    userId: string,
    page?: number,
    size?: number,
  ): Promise<BoardsAndPage | null>;
  getBoardFromRepo(
    boardId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
  getBoard(
    boardId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
  countBoards(userId: string): Promise<number>;
}

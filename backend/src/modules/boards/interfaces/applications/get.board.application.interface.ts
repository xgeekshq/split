import { GetBoardInterface } from '../getBoard.interface';
import { BoardsAndPage } from '../boards-page.interface';

export interface GetBoardApplicationInterface {
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
  getBoard(boardId: string, userId: string): Promise<GetBoardInterface>;
  countBoards(userId: string): Promise<number>;
}

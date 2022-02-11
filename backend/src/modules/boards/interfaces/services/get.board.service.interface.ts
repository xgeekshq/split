import { BoardDocument } from '../../schemas/board.schema';

export interface GetBoardService {
  getAllBoards(userId: string): Promise<BoardDocument[]>;
  getBoardFromRepo(boardId: string): Promise<BoardDocument>;
  getBoardWithEmail(boardId: string, userId: string): Promise<BoardDocument>;
}

import { BoardDocument } from '../../schemas/board.schema';

export interface GetBoardApplication {
  getAllBoards(userId: string): Promise<BoardDocument[]>;
  getBoardWithEmail(boardId: string, userId: string): Promise<BoardDocument>;
}

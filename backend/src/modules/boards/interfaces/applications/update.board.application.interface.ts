import { LeanDocument } from 'mongoose';
import BoardDto from '../../dto/board.dto';
import { BoardDocument } from '../../schemas/board.schema';

export interface UpdateBoardApplicationInterface {
  update(
    userId: string,
    boardId: string,
    boardData: BoardDto,
  ): Promise<LeanDocument<BoardDocument> | null>;
}

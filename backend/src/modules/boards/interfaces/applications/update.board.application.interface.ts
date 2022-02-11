import BoardDto from '../../dto/board.dto';
import { BoardDocument } from '../../schemas/board.schema';

export interface UpdateBoardApplication {
  update(
    userId: string,
    boardId: string,
    boardData: BoardDto,
  ): Promise<BoardDocument>;
}

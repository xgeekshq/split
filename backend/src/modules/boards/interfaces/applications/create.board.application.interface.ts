import BoardDto from '../../dto/board.dto';
import { BoardDocument } from '../../schemas/board.schema';

export interface CreateBoardApplicationInterface {
	create(boardData: BoardDto, userId: string): Promise<BoardDocument>;
}

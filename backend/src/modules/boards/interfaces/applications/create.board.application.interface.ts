import BoardDto from '../../dto/board.dto';
import { BoardDocument } from '../../entities/board.schema';

export interface CreateBoardApplicationInterface {
	create(boardData: BoardDto, userId: string): Promise<BoardDocument>;
}

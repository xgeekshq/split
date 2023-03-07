import BoardDto from '../../dto/board.dto';
import Board from '../../entities/board.schema';

export interface CreateBoardApplicationInterface {
	create(boardData: BoardDto, userId: string): Promise<Board>;
}

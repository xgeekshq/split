import Board from 'src/modules/boards/entities/board.schema';
import BoardDto from '../../dto/board.dto';

export interface CreateBoardApplicationInterface {
	create(boardData: BoardDto, userId: string): Promise<Board>;
}

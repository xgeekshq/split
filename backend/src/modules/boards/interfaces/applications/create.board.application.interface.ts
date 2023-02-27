import BoardDto from '../../dto/board.dto';
import { BoardDocument } from '../../entities/board.schema';
import { BoardUserDocument } from '../../entities/board.user.schema';

export interface CreateBoardApplicationInterface {
	create(boardData: BoardDto, userId: string): Promise<BoardDocument>;
	createBoardUser(boardId, userId): Promise<BoardUserDocument>;
}

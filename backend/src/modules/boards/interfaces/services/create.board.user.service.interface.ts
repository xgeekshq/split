import { BoardUserDocument } from 'src/modules/boards/entities/board.user.schema';
import BoardUserDto from '../../dto/board.user.dto';

export interface CreateBoardUserServiceInterface {
	saveBoardUsers(newUsers: BoardUserDto[], newBoardId: string): Promise<BoardUserDocument[]>;
	createBoardUser(board: string, user: string): Promise<BoardUserDocument>;
}

import BoardUser from 'src/modules/boardusers/entities/board.user.schema';
import BoardUserDto from '../../dto/board.user.dto';

export interface CreateBoardUserServiceInterface {
	saveBoardUsers(newUsers: BoardUserDto[], newBoardId?: string): Promise<BoardUser[]>;
	createBoardUser(board: string, user: string): Promise<BoardUser>;
}

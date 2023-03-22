import { SessionInterface } from 'src/libs/transactions/session.interface';
import BoardUserDto from '../../dto/board.user.dto';
import BoardUser from '../../entities/board.user.schema';

export interface CreateBoardUserServiceInterface extends SessionInterface {
	saveBoardUsers(
		newUsers: BoardUserDto[],
		newBoardId?: string,
		withSession?: boolean
	): Promise<BoardUser[]>;
	createBoardUser(board: string, user: string): Promise<BoardUser>;
}

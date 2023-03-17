import { SessionInterface } from 'src/libs/transactions/session.interface';
import BoardUser from 'src/modules/boards/entities/board.user.schema';
import BoardUserDto from '../../../boards/dto/board.user.dto';

export interface CreateBoardUserServiceInterface extends SessionInterface {
	saveBoardUsers(
		newUsers: BoardUserDto[],
		newBoardId?: string,
		withSession?: boolean
	): Promise<BoardUser[]>;
	createBoardUser(board: string, user: string): Promise<BoardUser>;
	startTransaction(): Promise<void>;
	commitTransaction(): Promise<void>;
	abortTransaction(): Promise<void>;
	endSession(): Promise<void>;
}

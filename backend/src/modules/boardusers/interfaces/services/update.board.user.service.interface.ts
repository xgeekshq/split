import { SessionInterface } from 'src/libs/transactions/session.interface';
import BoardUser from 'src/modules/boardusers/entities/board.user.schema';

export interface UpdateBoardUserServiceInterface extends SessionInterface {
	updateBoardUserRole(boardId: string, userId: string, role: string): Promise<BoardUser>;
	updateVoteUser(
		boardId: string,
		userId: string,
		count: number,
		withSession?: boolean,
		decrement?: boolean
	): Promise<BoardUser>;
}

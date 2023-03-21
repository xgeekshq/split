import { SessionInterface } from '../../../../libs/transactions/session.interface';
import { ObjectId } from 'mongoose';
import Board from 'src/modules/boards/entities/board.schema';

export interface DeleteBoardUserServiceInterface extends SessionInterface {
	deleteDividedBoardUsers(
		dividedBoards: Board[] | ObjectId[] | string[],
		withSession: boolean,
		boardId: ObjectId | string
	): Promise<number>;
	deleteSimpleBoardUsers(boardId: ObjectId | string, withSession: boolean): Promise<number>;
	deleteBoardUsers(boardUsers: string[]): Promise<number>;
}

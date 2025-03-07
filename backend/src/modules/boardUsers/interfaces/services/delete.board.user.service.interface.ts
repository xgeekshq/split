import { DeleteResult } from 'mongodb';
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
	deleteBoardUsersByBoardList(
		teamBoardsIds: string[],
		withSession?: boolean
	): Promise<DeleteResult>;
	deleteBoardUserFromOpenBoards(userId: string, withSession?: boolean);
	startTransaction(): Promise<void>;
	commitTransaction(): Promise<void>;
	abortTransaction(): Promise<void>;
	endSession(): Promise<void>;
}

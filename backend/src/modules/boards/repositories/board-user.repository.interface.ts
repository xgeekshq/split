import { ObjectId } from 'mongoose';
import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import Board from '../entities/board.schema';
import BoardUser from '../entities/board.user.schema';

export interface BoardUserRepositoryInterface extends BaseInterfaceRepository<BoardUser> {
	getAllBoardsIdsOfUser(userId: string): Promise<BoardUser[]>;
	deleteDividedBoardUsers(
		dividedBoards: Board[] | ObjectId[],
		withSession: boolean,
		boardId: ObjectId | string
	): Promise<number>;

	deleteSimpleBoardUsers(boardId: ObjectId | string, withSession: boolean): Promise<number>;

	getBoardResponsible(boardId: string): Promise<BoardUser>;

	getVotesCount(boardId: string): Promise<BoardUser[]>;

	updateBoardUserRole(boardId: string, userId: string, role: string): Promise<BoardUser>;
}

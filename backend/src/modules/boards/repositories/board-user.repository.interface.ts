import { ObjectId } from 'mongoose';
import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import BoardUserDto from '../dto/board.user.dto';
import Board from '../entities/board.schema';
import BoardUser from '../entities/board.user.schema';

export interface BoardUserRepositoryInterface extends BaseInterfaceRepository<BoardUser> {
	getAllBoardsIdsOfUser(userId: string): Promise<BoardUser[]>;
	getBoardResponsible(boardId: string): Promise<BoardUser>;
	getVotesCount(boardId: string): Promise<BoardUser[]>;
	getBoardUsers(board: string, user: string): Promise<BoardUser[]>;
	createBoardUsers(boardUsers: BoardUserDto[]): Promise<BoardUser[]>;
	updateBoardUserRole(boardId: string, userId: string, role: string): Promise<BoardUser>;
	deleteDividedBoardUsers(
		dividedBoards: Board[] | ObjectId[] | string[],
		withSession: boolean,
		boardId: ObjectId | string
	): Promise<number>;
	deleteSimpleBoardUsers(boardId: ObjectId | string, withSession: boolean): Promise<number>;
	deleteBoardUsers(boardUsers: string[]): Promise<number>;
}

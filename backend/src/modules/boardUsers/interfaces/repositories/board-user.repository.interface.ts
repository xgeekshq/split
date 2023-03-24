import { ObjectId } from 'mongoose';
import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import BoardUserDto from 'src/modules/boardUsers/dto/board.user.dto';
import Board from 'src/modules/boards/entities/board.schema';
import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';
import { DeleteResult } from 'mongodb';

export interface BoardUserRepositoryInterface extends BaseInterfaceRepository<BoardUser> {
	getAllBoardsIdsOfUser(userId: string): Promise<BoardUser[]>;
	getAllBoardUsersOfBoard(boardId: string): Promise<BoardUser[]>;
	getBoardResponsible(boardId: string): Promise<BoardUser>;
	getVotesCount(boardId: string): Promise<BoardUser[]>;
	getBoardUser(board: string, user: string): Promise<BoardUser>;
	getBoardUserPopulated(board: string, user: string): Promise<BoardUser>;
	createBoardUsers(boardUsers: BoardUserDto[], withSession?: boolean);
	updateBoardUserRole(boardId: string, userId: string, role: string): Promise<BoardUser>;
	updateVoteUser(
		boardId: string,
		userId: string,
		count: number,
		withSession?: boolean,
		decrement?: boolean
	): Promise<BoardUser>;
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
}

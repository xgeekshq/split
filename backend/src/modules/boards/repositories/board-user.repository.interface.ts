import { FilterQuery, ObjectId, QueryOptions, UpdateQuery } from 'mongoose';
import {
	BaseInterfaceRepository,
	PopulateType
} from 'src/libs/repositories/interfaces/base.repository.interface';
import BoardUserDto from '../dto/board.user.dto';
import Board from '../entities/board.schema';
import BoardUser from '../entities/board.user.schema';
import { SelectedValues } from 'src/libs/repositories/types';

export interface BoardUserRepositoryInterface extends BaseInterfaceRepository<BoardUser> {
	getAllBoardsIdsOfUser(userId: string): Promise<BoardUser[]>;
	getBoardResponsible(boardId: string): Promise<BoardUser>;
	getVotesCount(boardId: string): Promise<BoardUser[]>;
	getBoardUsers(board: string, user: string): Promise<BoardUser[]>;
	getBoardUser(
		board: string,
		user: string,
		select?: SelectedValues<BoardUser>,
		populate?: PopulateType
	): Promise<BoardUser>;
	createBoardUsers(boardUsers: BoardUserDto[]): Promise<BoardUser[]>;
	updateBoardUserRole(boardId: string, userId: string, role: string): Promise<BoardUser>;
	updateVoteUser(
		boardId: string,
		userId: string,
		count: number,
		withSession?: boolean,
		decrement?: boolean
	): Promise<BoardUser>;
	findBoardUserByFieldAndUpdate(
		value: FilterQuery<BoardUser>,
		query: UpdateQuery<BoardUser>,
		options?: QueryOptions<BoardUser>,
		populate?: PopulateType,
		withSession?: boolean
	): Promise<BoardUser>;
	deleteDividedBoardUsers(
		dividedBoards: Board[] | ObjectId[] | string[],
		withSession: boolean,
		boardId: ObjectId | string
	): Promise<number>;
	deleteSimpleBoardUsers(boardId: ObjectId | string, withSession: boolean): Promise<number>;
	deleteBoardUsers(boardUsers: string[]): Promise<number>;
}

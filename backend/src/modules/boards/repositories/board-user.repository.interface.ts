import { ObjectId } from 'mongoose';
import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import Board from '../entities/board.schema';
import BoardUser from '../entities/board.user.schema';

export interface BoardUserRepositoryInterface extends BaseInterfaceRepository<BoardUser> {
	getAllBoardsIdsOfUser(userId: string): Promise<BoardUser[]>;
	deleteManyBoardUsers(
		dividedBoards: Board[] | ObjectId[],
		withSession: boolean,
		boardId: ObjectId | string
	): Promise<number>;
}

import { PopulateType } from 'src/libs/repositories/interfaces/base.repository.interface';
import { SelectedValues } from 'src/libs/repositories/types';
import BoardUser from 'src/modules/boards/entities/board.user.schema';

export interface GetBoardUserServiceInterface {
	getAllBoardsOfUser(userId: string): Promise<BoardUser[]>;

	getBoardResponsible(boardId: string): Promise<BoardUser>;

	getVotesCount(boardId: string): Promise<BoardUser[]>;

	getBoardUsers(board: string, user: string): Promise<BoardUser[]>;

	getBoardUser(
		board: string,
		user: string,
		select?: SelectedValues<BoardUser>,
		populate?: PopulateType
	): Promise<BoardUser>;
}

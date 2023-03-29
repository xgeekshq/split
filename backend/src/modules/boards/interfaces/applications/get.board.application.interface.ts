import { LoginGuestUserResponse } from './../../../../libs/dto/response/login-guest-user.response';
import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../entities/board.schema';
import { BoardsAndPage } from '../boards-page.interface';
import UserDto from 'src/modules/users/dto/user.dto';

export interface GetBoardApplicationInterface {
	getUserBoardsOfLast3Months(
		userId: string,
		page?: number,
		size?: number
	): Promise<BoardsAndPage | null>;

	getAllBoards(
		teamId?: string,
		userId?: string,
		isSuperAdmin?: boolean,
		page?: number,
		size?: number
	): Promise<BoardsAndPage | null>;

	getPersonalBoards(userId?: string, page?: number, size?: number): Promise<BoardsAndPage | null>;

	getBoard(
		boardId: string,
		user: UserDto
	): Promise<
		| { board: LeanDocument<BoardDocument> }
		| null
		| {
				board: LeanDocument<BoardDocument>;
				mainBoardData: LeanDocument<BoardDocument>;
		  }
		| null
		| {
				guestUser: LoginGuestUserResponse;
				board: LeanDocument<BoardDocument>;
		  }
		| null
	>;

	countBoards(userId: string): Promise<number>;

	getAllBoardIdsAndTeamIdsOfUser(
		userId: string
	): Promise<{ boardIds: LeanDocument<unknown>[]; teamIds: unknown[] }>;

	isBoardPublic(boardId: string);
}

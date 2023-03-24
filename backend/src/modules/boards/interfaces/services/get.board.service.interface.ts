import { LoginGuestUserResponse } from './../../../../libs/dto/response/login-guest-user.response';
import Board from '../../entities/board.schema';
import { BoardsAndPage } from '../boards-page.interface';
import UserDto from 'src/modules/users/dto/user.dto';
import BoardUser from '../../../boardUsers/entities/board.user.schema';

export interface GetBoardServiceInterface {
	getUserBoardsOfLast3Months(
		userId: string,
		page?: number,
		size?: number
	): Promise<BoardsAndPage | null>;

	getSuperAdminBoards(userId: string, page?: number, size?: number): Promise<BoardsAndPage | null>;

	getUsersBoards(userId: string, page?: number, size?: number): Promise<BoardsAndPage | null>;

	getTeamBoards(teamId: string, page?: number, size?: number): Promise<BoardsAndPage | null>;

	getPersonalUserBoards(
		userId: string,
		page?: number,
		size?: number
	): Promise<BoardsAndPage | null>;

	getBoard(
		boardId: string,
		user: UserDto
	): Promise<
		| { board: Board }
		| null
		| {
				board: Board;
				mainBoard: Board;
		  }
		| null
		| {
				guestUser: LoginGuestUserResponse;
				board: Board;
		  }
		| null
	>;

	countBoards(userId: string): Promise<number>;

	getAllBoardIdsAndTeamIdsOfUser(userId: string): Promise<{ boardIds: any[]; teamIds: any[] }>;

	getBoardPopulated(boardId: string): Promise<Board>;

	getBoardById(boardId: string): Promise<Board>;

	getBoardData(boardId: string): Promise<Board>;

	getBoardUser(board: string, user: string): Promise<BoardUser>;

	getAllMainBoards(): Promise<Board[]>;

	isBoardPublic(boardId: string);
}

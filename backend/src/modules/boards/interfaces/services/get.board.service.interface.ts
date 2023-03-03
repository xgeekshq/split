import { LoginGuestUserResponse } from './../../../../libs/dto/response/login-guest-user.response';
import { Document, LeanDocument } from 'mongoose';
import Board, { BoardDocument } from '../../entities/board.schema';
import { BoardsAndPage } from '../boards-page.interface';
import BoardUser from '../../entities/board.user.schema';
import UserDto from 'src/modules/users/dto/user.dto';

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

	getBoardFromRepo(boardId: string): Promise<Board | null>;

	getBoardData(boardId: string): Promise<Board>;

	getBoard(
		boardId: string,
		user: UserDto
	): Promise<
		| { board: LeanDocument<BoardDocument> }
		| null
		| {
				board: LeanDocument<BoardDocument>;
				mainBoard: LeanDocument<BoardDocument>;
		  }
		| null
		| {
				guestUser: LoginGuestUserResponse;
				board: LeanDocument<BoardDocument>;
		  }
		| null
	>;

	getMainBoardData(
		boardId: string
	): Promise<LeanDocument<Board & Document<any, any, any> & { _id: any }> | null>;

	countBoards(userId: string): Promise<number>;

	getAllBoardIdsAndTeamIdsOfUser(
		userId: string
	): Promise<{ boardIds: LeanDocument<any>[]; teamIds: any[] }>;

	getAllBoardsByTeamId(teamId: string): Promise<LeanDocument<BoardDocument>[]>;

	getBoardUsers(board: string, user: string): Promise<BoardUser[]>;
}

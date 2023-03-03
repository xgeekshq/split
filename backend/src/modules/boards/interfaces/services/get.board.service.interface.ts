import { LeanDocument } from 'mongoose';
import { PopulateType } from 'src/libs/repositories/interfaces/base.repository.interface';
import { LoginGuestUserResponse } from './../../../../libs/dto/response/login-guest-user.response';
import Board, { BoardDocument } from '../../entities/board.schema';
import { BoardsAndPage } from '../boards-page.interface';

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
		userId: string
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

	countBoards(userId: string): Promise<number>;

	getAllBoardIdsAndTeamIdsOfUser(userId: string): Promise<{ boardIds: any[]; teamIds: any[] }>;

	getAllBoardsByTeamId(teamId: string): Promise<LeanDocument<BoardDocument>[]>;

	getBoardPopulated(boardId: string, populate?: PopulateType): Promise<Board>;

	getBoardById(boardId: string): Promise<Board>;
}

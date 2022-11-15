import { Document, LeanDocument } from 'mongoose';

import Board, { BoardDocument } from '../../schemas/board.schema';
import { BoardsAndPage } from '../boards-page.interface';

export interface GetBoardServiceInterface {
	getUserBoardsOfLast3Months(
		userId: string,
		page?: number,
		size?: number
	): Promise<BoardsAndPage | null>;

	getSuperAdminBoards(userId: string, page?: number, size?: number): Promise<BoardsAndPage | null>;

	getUsersBoards(userId: string, page?: number, size?: number): Promise<BoardsAndPage | null>;

	getBoardFromRepo(boardId: string): Promise<LeanDocument<BoardDocument> | null>;

	getBoard(
		boardId: string,
		userId: string
	): Promise<
		| { board: LeanDocument<BoardDocument> }
		| null
		| {
				board: LeanDocument<BoardDocument>;
				mainBoardData: LeanDocument<BoardDocument>;
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
}

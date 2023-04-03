import { LoginGuestUserResponse } from './../../../../libs/dto/response/login-guest-user.response';
import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../entities/board.schema';
import UserDto from 'src/modules/users/dto/user.dto';
import { GetBoardsPaginatedPresenter } from '../../applications/get-boards-for-dashboard.use-case';

export interface GetBoardApplicationInterface {
	getPersonalBoards(
		userId?: string,
		page?: number,
		size?: number
	): Promise<GetBoardsPaginatedPresenter>;

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

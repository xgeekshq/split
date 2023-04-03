import Board from '../../entities/board.schema';
import BoardUser from '../../../boardUsers/entities/board.user.schema';
import { QueryType } from '../findQuery';
import BoardsPaginatedPresenter from '../../presenter/boards-paginated.presenter';
import UserDto from 'src/modules/users/dto/user.dto';
import BoardPresenter from '../../presenter/board.presenter';

export interface GetBoardServiceInterface {
	getBoards(allBoards: boolean, query: QueryType, page, size): Promise<BoardsPaginatedPresenter>;

	getBoard(boardId: string, user: UserDto): Promise<BoardPresenter>;

	countBoards(userId: string): Promise<number>;

	getAllBoardIdsAndTeamIdsOfUser(userId: string): Promise<{ boardIds: any[]; teamIds: any[] }>;

	getBoardPopulated(boardId: string): Promise<Board>;

	getBoardById(boardId: string): Promise<Board>;

	getBoardData(boardId: string): Promise<Board>;

	getBoardUser(board: string, user: string): Promise<BoardUser>;

	getAllMainBoards(): Promise<Board[]>;

	isBoardPublic(boardId: string);
}

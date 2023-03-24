import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';

export interface GetBoardUserServiceInterface {
	getAllBoardsOfUser(userId: string): Promise<BoardUser[]>;

	getAllBoardUsersOfBoard(boardId: string): Promise<BoardUser[]>;

	getBoardResponsible(boardId: string): Promise<BoardUser>;

	getVotesCount(boardId: string): Promise<BoardUser[]>;

	getBoardUser(board: string, user: string): Promise<BoardUser>;

	getBoardUserPopulated(board: string, user: string): Promise<BoardUser>;
}

import BoardUser from 'src/modules/boards/entities/board.user.schema';

export interface UpdateBoardUserServiceInterface {
	updateBoardUserRole(boardId: string, userId: string, role: string): Promise<BoardUser>;
	updateVoteUser(
		boardId: string,
		userId: string,
		count: number,
		withSession?: boolean,
		decrement?: boolean
	): Promise<BoardUser>;
}

export interface DeleteBoardServiceInterface {
	delete(boardId: string, userId: string): Promise<boolean>;
	deleteBoardsByTeamId(teamId: string): Promise<boolean>;
}

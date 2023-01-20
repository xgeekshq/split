export interface DeleteBoardServiceInterface {
	delete(boardId: string): Promise<boolean>;
	deleteBoardsByTeamId(teamId: string): Promise<boolean>;
}

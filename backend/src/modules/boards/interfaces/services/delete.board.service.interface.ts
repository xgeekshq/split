export interface DeleteBoardServiceInterface {
	delete(boardId: string, userId: string, isSAdmin: boolean): Promise<boolean>;
	deleteBoardsByTeamId(teamId: string): Promise<boolean>;
}

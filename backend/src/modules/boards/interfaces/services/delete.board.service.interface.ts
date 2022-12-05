export interface DeleteBoardService {
	delete(boardId: string, userId: string): Promise<boolean>;
	deleteBoardsByTeamId(teamId: string): Promise<boolean>;
}

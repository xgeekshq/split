export interface DeleteBoardServiceInterface {
	deleteBoardBoardUsersAndSchedules(boardIdsToDelete: string[]): Promise<boolean>;
	deleteBoardsByTeamId(teamId: string): Promise<boolean>;
}

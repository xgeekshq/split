export interface DeleteTeamServiceInterface {
	delete(teamId: string): Promise<boolean>;
}

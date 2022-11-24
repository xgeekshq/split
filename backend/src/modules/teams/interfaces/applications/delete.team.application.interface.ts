export interface DeleteTeamApplicationInterface {
	delete(teamId: string): Promise<boolean>;
}

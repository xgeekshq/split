export interface GetTeamUserApplicationInterface {
	countTeamsOfUser(userId: string): Promise<number>;
}

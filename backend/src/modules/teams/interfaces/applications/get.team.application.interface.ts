export interface GetTeamApplicationInterface {
  countTeams(userId: string): Promise<number>;
}

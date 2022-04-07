export interface GetTeamApplication {
  countTeams(userId: string): Promise<number>;
}

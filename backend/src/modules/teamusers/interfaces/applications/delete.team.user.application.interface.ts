import TeamUser from 'src/modules/teams/entities/team.user.schema';
export interface DeleteTeamUserApplicationInterface {
	deleteTeamUser(teamUserId: string): Promise<TeamUser>;
}

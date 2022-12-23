import TeamUser from '../../entities/team.user.schema';

export interface DeleteTeamUserApplicationInterface {
	deleteTeamUser(teamUserId: string, withSession: boolean): Promise<TeamUser>;
}

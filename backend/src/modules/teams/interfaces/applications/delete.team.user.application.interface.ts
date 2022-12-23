import TeamUser from '../../entities/team.user.schema';

export interface DeleteTeamUserApplicationInterface {
	deleteTeamOfUser(userId: string, teamId: string, withSession: boolean): Promise<TeamUser>;
}

import TeamUser from '../../entities/team.user.schema';

export interface DeleteTeamUserServiceInterface {
	delete(userId: string): Promise<boolean>;
	deleteTeamUser(teamUserId: string, withSession: boolean): Promise<TeamUser>;
}

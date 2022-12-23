import TeamUser from '../../entities/team.user.schema';

export interface DeleteTeamUserServiceInterface {
	// delete doesn't return an object
	delete(userId: string): Promise<boolean>;
	deleteTeamUser(teamUserId: string, withSession: boolean): Promise<TeamUser>;
}

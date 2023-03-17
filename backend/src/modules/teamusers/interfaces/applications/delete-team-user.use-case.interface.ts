import TeamUser from 'src/modules/teams/entities/team.user.schema';

export interface DeleteTeamUserUseCaseInterface {
	execute(teamUserId: string): Promise<TeamUser>;
}

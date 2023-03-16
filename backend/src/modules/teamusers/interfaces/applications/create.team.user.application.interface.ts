import TeamUserDto from 'src/modules/teamusers/dto/team.user.dto';
import TeamUser from 'src/modules/teams/entities/team.user.schema';
export interface CreateTeamUserApplicationInterface {
	createTeamUser(teamUser: TeamUserDto): Promise<TeamUser>;
	createTeamUsers(teamUsers: TeamUserDto[]): Promise<TeamUser[]>;
}

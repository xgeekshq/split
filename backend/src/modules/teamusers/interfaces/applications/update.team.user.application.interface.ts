import TeamUserDto from 'src/modules/teamusers/dto/team.user.dto';
import TeamUser from 'src/modules/teams/entities/team.user.schema';
export interface UpdateTeamUserApplicationInterface {
	updateTeamUser(teamUserData: TeamUserDto): Promise<TeamUser>;
	AddAndRemoveTeamUsers(addUsers: TeamUserDto[], removeUsers: string[]): Promise<TeamUser[]>;
}

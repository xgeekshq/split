import TeamUserDto from '../../dto/team.user.dto';
import TeamUser from '../../entities/team.user.schema';

export interface UpdateTeamUserServiceInterface {
	updateTeamUser(teamUserData: TeamUserDto): Promise<TeamUser>;
	addAndRemoveTeamUsers(addUsers: TeamUserDto[], removeUsers: string[]): Promise<TeamUser[]>;
}

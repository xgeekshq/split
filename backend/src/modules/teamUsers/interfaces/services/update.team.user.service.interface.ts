import TeamUserDto from '../../dto/team.user.dto';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';

export interface UpdateTeamUserServiceInterface {
	updateTeamUser(teamUserData: TeamUserDto): Promise<TeamUser>;
}

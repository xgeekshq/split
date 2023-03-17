import TeamUser from 'src/modules/teams/entities/team.user.schema';
import TeamUserDto from 'src/modules/teamusers/dto/team.user.dto';

export interface UpdateTeamUserUseCaseInterface {
	execute(teamUserData: TeamUserDto): Promise<TeamUser>;
}

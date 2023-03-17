import TeamUser from 'src/modules/teams/entities/team.user.schema';
import TeamUserDto from 'src/modules/teamusers/dto/team.user.dto';

export interface CreateTeamUserUseCaseInterface {
	execute(teamUser: TeamUserDto): Promise<TeamUser>;
}

import TeamUser from 'src/modules/teams/entities/team.user.schema';
import TeamUserDto from 'src/modules/teamusers/dto/team.user.dto';

export interface CreateTeamUsersUseCaseInterface {
	execute(teamUsers: TeamUserDto[]): Promise<TeamUser[]>;
}

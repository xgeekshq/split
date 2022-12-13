import TeamDto from '../../dto/team.dto';
import TeamUserDto from '../../dto/team.user.dto';
import TeamUser from '../../entities/team.user.schema';
import Team from '../../entities/teams.schema';

export interface CreateTeamServiceInterface {
	create(teamData: TeamDto): Promise<Team>;

	createTeam(name: string): Promise<Team>;

	createTeamUser(teamUser: TeamUserDto): Promise<TeamUser>;
}

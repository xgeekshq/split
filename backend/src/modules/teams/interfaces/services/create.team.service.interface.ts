import TeamDto from '../../dto/team.dto';
import Team from '../../entities/teams.schema';

export interface CreateTeamServiceInterface {
	create(teamData: TeamDto): Promise<Team>;

	createTeam(name: string): Promise<Team>;
}

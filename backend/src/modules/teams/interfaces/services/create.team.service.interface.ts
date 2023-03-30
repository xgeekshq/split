import TeamDto from '../../dto/team.dto';
import Team from '../../entities/team.schema';

export interface CreateTeamServiceInterface {
	create(teamData: TeamDto): Promise<Team>;
}

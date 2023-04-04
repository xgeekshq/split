import { CreateTeamDto } from '../../dto/crate-team.dto';
import Team from '../../entities/team.schema';

export interface CreateTeamApplicationInterface {
	create(teamData: CreateTeamDto): Promise<Team>;
}

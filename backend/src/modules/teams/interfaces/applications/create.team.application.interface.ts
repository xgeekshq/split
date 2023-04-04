import { CreateTeamDto } from 'src/modules/teams/dto/create-team.dto';
import Team from '../../entities/team.schema';

export interface CreateTeamApplicationInterface {
	create(teamData: CreateTeamDto): Promise<Team>;
}

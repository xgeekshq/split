import { CreateTeamDto } from '../../dto/create-team.dto';
import TeamUserDto from '../../../teamUsers/dto/team.user.dto';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import Team from '../../entities/team.schema';

export interface CreateTeamApplicationInterface {
	createTeamUser(teamUser: TeamUserDto): Promise<TeamUser>;

	create(teamData: CreateTeamDto): Promise<Team>;
}

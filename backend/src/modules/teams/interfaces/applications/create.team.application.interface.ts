import { CreateTeamDto } from '../../dto/crate-team.dto';
import TeamUserDto from '../../../teamUsers/dto/team.user.dto';
import TeamUser from '../../entities/team.user.schema';
import Team from '../../entities/teams.schema';

export interface CreateTeamApplicationInterface {
	createTeamUser(teamUser: TeamUserDto): Promise<TeamUser>;

	create(teamData: CreateTeamDto): Promise<Team>;
}

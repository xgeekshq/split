import { CreateTeamDto } from '../../dto/crate-team.dto';
import TeamUserDto from '../../dto/team.user.dto';
import { TeamUserDocument } from '../../schemas/team.user.schema';
import { TeamDocument } from '../../schemas/teams.schema';

export interface CreateTeamApplicationInterface {
	createTeamUser(teamUser: TeamUserDto): Promise<TeamUserDocument>;

	create(teamData: CreateTeamDto): Promise<TeamDocument>;
}

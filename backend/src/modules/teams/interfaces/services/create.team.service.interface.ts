import TeamDto from '../../dto/team.dto';
import TeamUserDto from '../../dto/team.user.dto';
import { TeamUserDocument } from '../../schemas/team.user.schema';
import { TeamDocument } from '../../schemas/teams.schema';

export interface CreateTeamServiceInterface {
	create(teamData: TeamDto, userId: string): Promise<TeamDocument>;

	createTeam(name: string): Promise<TeamDocument>;

	createTeamUser(teamUser: TeamUserDto): Promise<TeamUserDocument>;
}

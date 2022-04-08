import TeamDto from '../../dto/team.dto';
import { TeamDocument } from '../../schemas/teams.schema';

export interface CreateTeamService {
  create(teamData: TeamDto, userId: string): Promise<TeamDocument>;
}

import TeamDto from '../../dto/team.dto';
import { TeamDocument } from '../../schemas/teams.schema';

export interface CreateTeamApplication {
  create(teamData: TeamDto, userId: string): Promise<TeamDocument>;
}

import { LeanDocument } from 'mongoose';

import TeamUserDto from '../../dto/team.user.dto';
import { TeamUserDocument } from '../../schemas/team.user.schema';

export interface UpdateTeamServiceInterface {
	updateTeamUser(teamData: TeamUserDto): Promise<LeanDocument<TeamUserDocument> | null>;
}

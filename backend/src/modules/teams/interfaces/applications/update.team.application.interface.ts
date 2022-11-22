import { LeanDocument } from 'mongoose';

import TeamUserDto from '../../dto/team.user.dto';
import { TeamUserDocument } from '../../schemas/team.user.schema';

export interface UpdateTeamApplicationInterface {
	updateTeamUser(
		userId: string,
		teamId: string,
		teamData: TeamUserDto
	): Promise<LeanDocument<TeamUserDocument> | null>;
}

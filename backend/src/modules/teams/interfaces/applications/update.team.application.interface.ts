import { LeanDocument } from 'mongoose';
import TeamUserDto from '../../dto/team.user.dto';
import { TeamUserDocument } from '../../entities/team.user.schema';

export interface UpdateTeamApplicationInterface {
	updateTeamUser(teamData: TeamUserDto): Promise<LeanDocument<TeamUserDocument> | null>;
}

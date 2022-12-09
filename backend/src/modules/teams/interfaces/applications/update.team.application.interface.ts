import { LeanDocument } from 'mongoose';
import TeamUserDto from '../../dto/team.user.dto';
import { TeamUserDocument } from '../../schemas/team.user.schema';

export interface UpdateTeamApplicationInterface {
	updateTeamUser(teamData: TeamUserDto): Promise<LeanDocument<TeamUserDocument> | null>;
	addAndRemoveTeamUsers(addUsers: TeamUserDto[], removeUsers: string[]): Promise<boolean>;
}

import { LeanDocument } from 'mongoose';
import TeamUserDto from '../../dto/team.user.dto';
import { TeamUserDocument } from '../../entities/team.user.schema';

export interface UpdateTeamServiceInterface {
	updateTeamUser(teamData: TeamUserDto): Promise<LeanDocument<TeamUserDocument> | null>;
	addAndRemoveTeamUsers(
		addUsers: TeamUserDto[],
		removeUsers: string[]
	): Promise<LeanDocument<TeamUserDocument[]>>;
}

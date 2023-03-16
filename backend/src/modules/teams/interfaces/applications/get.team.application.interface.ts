import { LeanDocument } from 'mongoose';
import { TeamQueryParams } from 'src/libs/dto/param/team.query.params';
import UserDto from 'src/modules/users/dto/user.dto';
import { TeamDocument } from '../../entities/teams.schema';

export interface GetTeamApplicationInterface {
	getAllTeams(user: UserDto): Promise<LeanDocument<TeamDocument>[]>;

	getTeam(
		teamId: string,
		teamQueryParams?: TeamQueryParams
	): Promise<LeanDocument<TeamDocument> | null>;

	getTeamsOfUser(userId: string): Promise<LeanDocument<TeamDocument>[]>;

	getTeamsUserIsNotMember(userId: string): Promise<LeanDocument<TeamDocument>[]>;
}

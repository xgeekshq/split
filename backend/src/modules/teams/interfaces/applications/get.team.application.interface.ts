import { LeanDocument } from 'mongoose';
import { TeamQueryParams } from 'src/libs/dto/param/team.query.params';
import { TeamDocument } from '../../entities/team.schema';

export interface GetTeamApplicationInterface {
	getAllTeams(): Promise<LeanDocument<TeamDocument>[]>;

	getTeam(
		teamId: string,
		teamQueryParams?: TeamQueryParams
	): Promise<LeanDocument<TeamDocument> | null>;

	getTeamsOfUser(userId: string): Promise<LeanDocument<TeamDocument>[]>;

	getTeamsUserIsNotMember(userId: string): Promise<LeanDocument<TeamDocument>[]>;
}

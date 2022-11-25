import { LeanDocument } from 'mongoose';
import { TeamQueryParams } from 'src/libs/dto/param/team.query.params';
import { TeamDocument } from '../../schemas/teams.schema';

export interface GetTeamApplicationInterface {
	countTeams(userId: string): Promise<number>;

	getAllTeams(): Promise<LeanDocument<TeamDocument>[]>;

	getTeam(
		teamId: string,
		teamQueryParams?: TeamQueryParams
	): Promise<LeanDocument<TeamDocument> | null>;

	getTeamsOfUser(userId: string): Promise<LeanDocument<TeamDocument>[]>;
}

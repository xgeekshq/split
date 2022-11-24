import { LeanDocument } from 'mongoose';

import { TeamQueryParams } from 'libs/dto/param/team.query.params';

import { TeamUserDocument } from '../../schemas/team.user.schema';
import { TeamDocument } from '../../schemas/teams.schema';

export interface GetTeamServiceInterface {
	countTeams(userId: string): Promise<number>;

	countAllTeams(): Promise<number>;

	getTeamsOfUser(userId: string): Promise<LeanDocument<TeamDocument>[]>;

	getTeam(
		teamId: string,
		teamQueryParams?: TeamQueryParams
	): Promise<LeanDocument<TeamDocument> | null>;

	getUsersOfTeam(teamId: string): Promise<LeanDocument<TeamUserDocument>[]>;

	getTeamUser(userId: string, teamId: string): Promise<LeanDocument<TeamUserDocument> | null>;

	getAllTeams(): Promise<LeanDocument<TeamDocument>[]>;
}

import { Document } from 'mongoose';
import { TeamQueryParams } from 'src/libs/dto/param/team.query.params';
import { TeamDocument } from '../../entities/team.schema';

export interface GetTeamApplicationInterface {
	getAllTeams(): Promise<Document<TeamDocument>[]>;

	getTeam(
		teamId: string,
		teamQueryParams?: TeamQueryParams
	): Promise<Document<TeamDocument> | null>;

	getTeamsOfUser(userId: string): Promise<Document<TeamDocument>[]>;

	getTeamsUserIsNotMember(userId: string): Promise<Document<TeamDocument>[]>;
}

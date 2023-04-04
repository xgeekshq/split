import { LeanDocument } from 'mongoose';
import { TeamQueryParams } from 'src/libs/dto/param/team.query.params';
import Team from '../../entities/team.schema';

export interface GetTeamServiceInterface {
	getAllTeams(): Promise<LeanDocument<Team>[]>;
	getTeam(teamId: string, teamQueryParams?: TeamQueryParams): Promise<Team | null>;
	getTeamsOfUser(userId: string): Promise<Team[]>;
	getTeamsUserIsNotMember(userId: string): Promise<Team[]>;
	countAllTeams(): Promise<number>;
}

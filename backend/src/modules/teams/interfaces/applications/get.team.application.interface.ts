import { LeanDocument } from 'mongoose';
import { TeamDocument } from '../../schemas/teams.schema';
import { TeamQueryParams } from '../../../../libs/dto/param/team.query.params';

export interface GetTeamApplicationInterface {
  countTeams(userId: string): Promise<number>;

  getAllTeams(): Promise<LeanDocument<TeamDocument>[]>;

  getTeam(
    teamId: string,
    teamQueryParams?: TeamQueryParams,
  ): Promise<LeanDocument<TeamDocument> | null>;

  getTeamsOfUser(userId: string): Promise<LeanDocument<TeamDocument>[]>;
}

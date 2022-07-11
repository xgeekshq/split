import { LeanDocument } from 'mongoose';
import { TeamDocument } from '../../schemas/teams.schema';
import { TeamFilterOptions } from '../../../../libs/dto/param/team.filter.options';

export interface GetTeamApplicationInterface {
  countTeams(userId: string): Promise<number>;

  getAllTeams(): Promise<LeanDocument<TeamDocument>[]>;

  getTeam(
    teamId: string,
    teamFilterOptions?: TeamFilterOptions,
  ): Promise<LeanDocument<TeamDocument> | null>;

  getTeamsOfUser(userId: string): Promise<LeanDocument<TeamDocument>[]>;
}

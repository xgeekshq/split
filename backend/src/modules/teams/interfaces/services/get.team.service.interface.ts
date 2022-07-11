import { LeanDocument } from 'mongoose';
import { TeamFilterOptions } from 'src/libs/dto/param/team.filter.options';
import { TeamUserDocument } from '../../schemas/team.user.schema';
import { TeamDocument } from '../../schemas/teams.schema';

export interface GetTeamServiceInterface {
  countTeams(userId: string): Promise<number>;

  countAllTeams(): Promise<number>;

  getTeamsOfUser(userId: string): Promise<LeanDocument<TeamDocument>[]>;

  getTeam(
    teamId: string,
    teamFilterOptions?: TeamFilterOptions,
  ): Promise<LeanDocument<TeamDocument> | null>;

  getUsersOfTeam(teamId: string): Promise<LeanDocument<TeamUserDocument>[]>;

  getTeamUser(
    userId: string,
    boardId: string,
  ): Promise<LeanDocument<TeamUserDocument> | null>;

  getAllTeams(): Promise<LeanDocument<TeamDocument>[]>;
}

import { LeanDocument } from 'mongoose';
import { TeamDocument } from '../../schemas/teams.schema';

export interface GetTeamApplicationInterface {
  countTeams(userId: string): Promise<number>;
  getAllTeams(): Promise<LeanDocument<TeamDocument>[]>;
  getTeam(teamId: string): Promise<LeanDocument<TeamDocument> | null>;
  getTeamStakeholders(
    teamId: string,
  ): Promise<LeanDocument<TeamDocument> | null>;
  getTeamsOfUser(userId: string): Promise<LeanDocument<TeamDocument>[]>;
}

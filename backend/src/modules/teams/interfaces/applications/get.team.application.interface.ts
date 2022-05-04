import { LeanDocument } from 'mongoose';
import { TeamDocument } from '../../schemas/teams.schema';

export interface GetTeamApplicationInterface {
  countTeams(userId: string): Promise<number>;
  getAllTeams(): Promise<LeanDocument<TeamDocument>[]>;
  getTeamsOfUser(userId: string): Promise<LeanDocument<TeamDocument>[]>;
}

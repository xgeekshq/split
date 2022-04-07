import { LeanDocument } from 'mongoose';
import { TeamUserDocument } from '../../schemas/team.user.schema';

export interface GetTeamService {
  countTeams(userId: string): Promise<number>;
  getTeamsOfUser(userId: string): Promise<LeanDocument<TeamUserDocument>[]>;
  getTeamUser(
    userId: string,
    boardId: string,
  ): Promise<LeanDocument<TeamUserDocument> | null>;
}

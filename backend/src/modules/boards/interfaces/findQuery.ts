import { LeanDocument } from 'mongoose';
import { TeamUserDocument } from '../../teams/schemas/team.user.schema';

export type QueryType = {
  $and: (
    | {
        isSubBoard: boolean;
        updatedAt?: {
          $gte: number;
        };
        $or?: undefined;
      }
    | {
        $or: (
          | {
              _id: {
                $in: LeanDocument<any>[];
              };
              team?: undefined;
            }
          | {
              team: {
                $in?: LeanDocument<TeamUserDocument>[];
                $ne?: undefined | null;
              };
              _id?: undefined;
            }
        )[];
        isSubBoard?: undefined;
        updatedAt?: undefined;
      }
  )[];
};

import { LeanDocument } from 'mongoose';
import { TeamDocument } from 'src/modules/teams/schemas/teams.schema';

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
								$in: LeanDocument<unknown>[];
							};
							team?: undefined;
					  }
					| {
							team: {
								$in?: LeanDocument<TeamDocument>[];
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

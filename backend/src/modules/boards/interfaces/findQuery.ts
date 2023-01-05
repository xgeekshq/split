import { LeanDocument } from 'mongoose';
import Team from 'src/modules/teams/entities/teams.schema';

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
								$in?: Team[] | string[];
								$type?: number;
								$ne?: undefined | null;
							};
							_id?: undefined;
					  }
					| {
							team: Team | string;
							_id?: undefined;
					  }
				)[];
				isSubBoard?: undefined;
				updatedAt?: undefined;
		  }
	)[];
};

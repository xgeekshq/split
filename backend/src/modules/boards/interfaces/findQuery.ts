import { FilterQuery, LeanDocument } from 'mongoose';
import Team from 'src/modules/teams/entities/teams.schema';
import { BoardDocument } from '../entities/board.schema';

export type QueryType =
	| {
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
				| {
						_id: {
							$in: LeanDocument<unknown>[];
						};
				  }
				| {
						team: string;
				  }
			)[];
	  }
	| FilterQuery<BoardDocument>;

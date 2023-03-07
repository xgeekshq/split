import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import {
	BaseInterfaceRepository,
	PopulateType
} from 'src/libs/repositories/interfaces/base.repository.interface';
import Board from 'src/modules/boards/entities/board.schema';

export interface VotesBoardRepositoryInterface extends BaseInterfaceRepository<Board> {
	findBoardByFieldAndUpdate(
		value: FilterQuery<Board>,
		query: UpdateQuery<Board>,
		options?: QueryOptions<Board>,
		populate?: PopulateType,
		withSession?: boolean
	): Promise<Board>;
}

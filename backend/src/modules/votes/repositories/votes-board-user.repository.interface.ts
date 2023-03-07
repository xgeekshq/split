import BoardUser from 'src/modules/boards/entities/board.user.schema';
import {
	BaseInterfaceRepository,
	PopulateType
} from 'src/libs/repositories/interfaces/base.repository.interface';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';

export interface VotesBoardUserRepositoryInterface extends BaseInterfaceRepository<BoardUser> {
	findBoardUserByFieldAndUpdate(
		value: FilterQuery<BoardUser>,
		query: UpdateQuery<BoardUser>,
		options?: QueryOptions<BoardUser>,
		populate?: PopulateType,
		withSession?: boolean
	): Promise<BoardUser>;
}

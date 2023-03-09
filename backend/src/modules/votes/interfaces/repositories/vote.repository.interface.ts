import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import {
	BaseInterfaceRepository,
	PopulateType
} from 'src/libs/repositories/interfaces/base.repository.interface';
import Board from 'src/modules/boards/entities/board.schema';

export interface VoteRepositoryInterface extends BaseInterfaceRepository<Board> {
	findBoardByFieldAndUpdate(
		value: FilterQuery<Board>,
		query: UpdateQuery<Board>,
		options?: QueryOptions<Board>,
		populate?: PopulateType,
		withSession?: boolean
	): Promise<Board>;

	insertCardItemVote(
		boardId: string,
		cardId: string,
		cardItemId: string,
		votes: string[],
		withSession?: boolean
	): Promise<Board>;

	insertCardGroupVote(
		boardId: string,
		userId: string,
		count: number,
		cardId: string,
		withSession?: boolean
	): Promise<Board>;

	removeVotesFromCardItem(
		boardId: string,
		cardId: string,
		cardItemId: string,
		votes: string[],
		withSession?: boolean
	): Promise<Board>;

	removeVotesFromCard(
		boardId: string,
		mappedVotes: string[],
		cardId: string,
		withSession?: boolean
	): Promise<Board>;
}

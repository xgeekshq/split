import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { VotesBoardRepositoryInterface } from './votes-board.repository.interface';
import { PopulateType } from 'src/libs/repositories/interfaces/base.repository.interface';

@Injectable()
export class VotesBoardRepository
	extends MongoGenericRepository<Board>
	implements VotesBoardRepositoryInterface
{
	constructor(@InjectModel(Board.name) private model: Model<BoardDocument>) {
		super(model);
	}

	/* UPDATE BOARDS */
	findBoardByFieldAndUpdate(
		value: FilterQuery<Board>,
		query: UpdateQuery<Board>,
		options?: QueryOptions<Board>,
		populate?: PopulateType,
		withSession?: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(value, query, options, populate, withSession);
	}

	/* DELETE VOTES */
}

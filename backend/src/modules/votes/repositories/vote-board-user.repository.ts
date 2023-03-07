import BoardUser, { BoardUserDocument } from 'src/modules/boards/entities/board.user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import { VoteBoardUserRepositoryInterface } from './vote-board-user.repository.interface';
import { PopulateType } from 'src/libs/repositories/interfaces/base.repository.interface';

@Injectable()
export class VoteBoardUserRepository
	extends MongoGenericRepository<BoardUser>
	implements VoteBoardUserRepositoryInterface
{
	constructor(@InjectModel(BoardUser.name) private model: Model<BoardUserDocument>) {
		super(model);
	}

	/* UPDATE BOARD USER */
	findBoardUserByFieldAndUpdate(
		value: FilterQuery<BoardUser>,
		query: UpdateQuery<BoardUser>,
		options?: QueryOptions<BoardUser>,
		populate?: PopulateType,
		withSession?: boolean
	): Promise<BoardUser> {
		return this.findOneByFieldAndUpdate(value, query, options, populate, withSession);
	}
}

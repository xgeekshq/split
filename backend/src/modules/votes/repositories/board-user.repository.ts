import BoardUser, { BoardUserDocument } from 'src/modules/boards/entities/board.user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import { VotesBoardUserRepositoryInterface } from './board-user.repository.interface';

@Injectable()
export class VotesBoardUserRepository
	extends MongoGenericRepository<BoardUser>
	implements VotesBoardUserRepositoryInterface
{
	constructor(@InjectModel(BoardUser.name) private model: Model<BoardUserDocument>) {
		super(model);
	}

	/* GET BOARDS */

	/* DELETE VOTES */
}

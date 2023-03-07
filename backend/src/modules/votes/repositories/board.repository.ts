import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { VotesBoardRepositoryInterface } from './board.repository.interface';

@Injectable()
export class VotesBoardRepository
	extends MongoGenericRepository<Board>
	implements VotesBoardRepositoryInterface
{
	constructor(@InjectModel(Board.name) private model: Model<BoardDocument>) {
		super(model);
	}

	/* GET BOARDS */

	/* DELETE VOTES */
}

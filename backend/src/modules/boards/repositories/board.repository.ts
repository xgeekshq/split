import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { BoardDataPopulate } from '../utils/populate-board';
import { BoardRepositoryInterface } from './board.repository.interface';

@Injectable()
export class BoardRepository
	extends MongoGenericRepository<Board>
	implements BoardRepositoryInterface
{
	constructor(@InjectModel(Board.name) private model: Model<BoardDocument>) {
		super(model);
	}
	getBoard(boardId: string): Promise<Board> {
		return this.findOneById(boardId);
	}

	getBoardFromRepo(boardId: string) {
		return this.findOneById(boardId, {}, BoardDataPopulate);
	}
}

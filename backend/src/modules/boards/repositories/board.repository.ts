import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { BoardDataPopulate, GetBoardDataPopulate } from '../utils/populate-board';
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

	getBoardPopulated(boardId: string) {
		return this.findOneById(boardId, {}, BoardDataPopulate);
	}

	getMainBoard(boardId: string) {
		return this.findOneByField({ dividedBoards: { $in: boardId } }, 'title');
	}

	getBoardData(boardId: string) {
		return this.findOneById(
			boardId,
			'-slackEnable -slackChannelId -recurrent -__v',
			GetBoardDataPopulate
		);
	}
}

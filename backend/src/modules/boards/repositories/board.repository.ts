import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { QueryType } from '../interfaces/findQuery';
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

	/* Get Boards */

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

	getAllBoardsByTeamId(teamId: string) {
		return this.findAllWithQuery({ team: teamId }, 'board', undefined, false);
	}

	countBoards(boardIds: string[], teamIds: string[]) {
		return this.model
			.countDocuments({
				$and: [
					{ isSubBoard: false },
					{ $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] }
				]
			})
			.exec();
	}

	getCountPage(query: QueryType) {
		return this.model.find(query).countDocuments().exec();
	}

	// getAllBoards(allBoards: boolean, query: QueryType, page = 0, size = 10) {
	// 	return this.model.find(query).sort();
	// }
}

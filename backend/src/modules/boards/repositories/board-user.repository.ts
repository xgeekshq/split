import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board from '../entities/board.schema';
import BoardUser, { BoardUserDocument } from '../entities/board.user.schema';
import { BoardUserRepositoryInterface } from './board-user.repository.interface';

@Injectable()
export class BoardUserRepository
	extends MongoGenericRepository<BoardUser>
	implements BoardUserRepositoryInterface
{
	constructor(@InjectModel(BoardUser.name) private model: Model<BoardUserDocument>) {
		super(model);
	}

	getAllBoardsIdsOfUser(userId: string) {
		return this.model.find({ user: userId }).select('board').lean().exec();
	}

	deleteDividedBoardUsers(
		dividedBoards: Board[] | ObjectId[],
		withSession: boolean,
		boardId: ObjectId | string
	) {
		return this.deleteMany({ board: { $in: [...dividedBoards, boardId] } }, withSession);
	}

	deleteBoardUsers(boardId: string, withSession: boolean) {
		return this.deleteMany({ board: boardId }, withSession);
	}
}

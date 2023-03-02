import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BoardRoles } from 'src/libs/enum/board.roles';
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

	deleteSimpleBoardUsers(boardId: ObjectId | string, withSession: boolean) {
		return this.deleteMany(
			{
				board: boardId
			},
			withSession
		);
	}

	getBoardResponsible(boardId: string) {
		return this.findOneByFieldWithQuery(
			{ board: boardId, role: BoardRoles.RESPONSIBLE },
			{},
			{ path: 'user' }
		);
	}

	getVotesCount(boardId: string) {
		return this.model.find({ board: boardId }, ['votesCount']).exec();
	}

	updateBoardUserRole(boardId: string, userId: string, role: string) {
		return this.findOneByFieldAndUpdate(
			{
				user: userId,
				board: boardId
			},
			{
				role: role
			}
		);
	}
}

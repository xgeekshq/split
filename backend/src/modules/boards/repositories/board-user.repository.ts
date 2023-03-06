import { PopulateType } from 'src/libs/repositories/interfaces/base.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import BoardUserDto from '../dto/board.user.dto';
import Board from '../entities/board.schema';
import BoardUser, { BoardUserDocument } from '../entities/board.user.schema';
import { BoardUserRepositoryInterface } from './board-user.repository.interface';
import { SelectedValues } from 'src/libs/repositories/types';

@Injectable()
export class BoardUserRepository
	extends MongoGenericRepository<BoardUser>
	implements BoardUserRepositoryInterface
{
	constructor(@InjectModel(BoardUser.name) private model: Model<BoardUserDocument>) {
		super(model);
	}

	/* GET BOARD USERS */
	getAllBoardsIdsOfUser(userId: string) {
		return this.findAllWithQuery({ user: userId }, null, 'board');
	}

	getBoardResponsible(boardId: string) {
		return this.findOneByFieldWithQuery({ board: boardId, role: BoardRoles.RESPONSIBLE }, null, {
			path: 'user'
		});
	}

	getVotesCount(boardId: string) {
		return this.findAllWithQuery({ board: boardId }, ['votesCount']);
	}

	getBoardUsers(board: string, user: string) {
		return this.findAllWithQuery({ board, user });
	}

	getBoardUser(
		board: string,
		user: string,
		select?: SelectedValues<BoardUser>,
		populate?: PopulateType
	) {
		return this.findOneByFieldWithQuery({ board, user }, select, populate);
	}

	/* CREATE BOARD USERS */
	createBoardUsers(boardUsers: BoardUserDto[]) {
		return this.insertMany<BoardUserDto>(boardUsers);
	}

	/* UPDATE BOARD USERS */
	updateBoardUserRole(boardId: string, userId: string, role: BoardRoles) {
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

	/* DELETE BOARD USERS */
	deleteDividedBoardUsers(
		dividedBoards: Board[] | ObjectId[] | string[],
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

	deleteBoardUsers(boardUsers: string[]) {
		return this.deleteMany({
			_id: { $in: boardUsers }
		});
	}
}

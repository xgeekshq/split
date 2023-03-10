import { DeleteBoardUserServiceInterface } from './../interfaces/services/delete.board.user.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { BoardUserRepositoryInterface } from '../interfaces/repositories/board-user.repository.interface';
import { TYPES } from '../interfaces/types';
import { Schema } from 'mongoose';
import Board from 'src/modules/boards/entities/board.schema';

@Injectable()
export default class DeleteBoardUserService implements DeleteBoardUserServiceInterface {
	constructor(
		@Inject(TYPES.repositories.BoardUserRepository)
		private readonly boardUserRepository: BoardUserRepositoryInterface
	) {}

	deleteDividedBoardUsers(
		dividedBoards: Board[] | Schema.Types.ObjectId[] | string[],
		withSession: boolean,
		boardId: string | Schema.Types.ObjectId
	): Promise<number> {
		return this.boardUserRepository.deleteDividedBoardUsers(dividedBoards, withSession, boardId);
	}

	deleteSimpleBoardUsers(
		boardId: string | Schema.Types.ObjectId,
		withSession: boolean
	): Promise<number> {
		return this.boardUserRepository.deleteSimpleBoardUsers(boardId, withSession);
	}

	deleteBoardUsers(boardUsers: string[]): Promise<number> {
		return this.boardUserRepository.deleteBoardUsers(boardUsers);
	}

	startTransaction(): Promise<void> {
		return this.startTransaction();
	}

	commitTransaction(): Promise<void> {
		return this.commitTransaction();
	}

	abortTransaction(): Promise<void> {
		return this.abortTransaction();
	}

	endSession(): Promise<void> {
		return this.endSession();
	}
}

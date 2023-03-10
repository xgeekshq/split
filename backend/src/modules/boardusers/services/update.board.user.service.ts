import { Inject, Injectable } from '@nestjs/common';
import { BoardUserRepositoryInterface } from '../interfaces/repositories/board-user.repository.interface';
import { TYPES } from '../interfaces/types';
import { UpdateBoardUserServiceInterface } from '../interfaces/services/update.board.user.service.interface';
import BoardUser from 'src/modules/boards/entities/board.user.schema';

@Injectable()
export default class UpdateBoardUserService implements UpdateBoardUserServiceInterface {
	constructor(
		@Inject(TYPES.repositories.BoardUserRepository)
		private readonly boardUserRepository: BoardUserRepositoryInterface
	) {}

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

	updateBoardUserRole(boardId: string, userId: string, role: string): Promise<BoardUser> {
		return this.boardUserRepository.updateBoardUserRole(boardId, userId, role);
	}

	updateVoteUser(
		boardId: string,
		userId: string,
		count: number,
		withSession?: boolean,
		decrement?: boolean
	): Promise<BoardUser> {
		return this.boardUserRepository.updateVoteUser(boardId, userId, count, withSession, decrement);
	}
}

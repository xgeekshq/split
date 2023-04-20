import { DeleteBoardUserServiceInterface } from '../interfaces/services/delete.board.user.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { BoardUserRepositoryInterface } from '../interfaces/repositories/board-user.repository.interface';
import { BOARD_USER_REPOSITORY } from '../constants';
import { Schema } from 'mongoose';
import Board from 'src/modules/boards/entities/board.schema';
import { DeleteResult } from 'mongodb';

@Injectable()
export default class DeleteBoardUserService implements DeleteBoardUserServiceInterface {
	constructor(
		@Inject(BOARD_USER_REPOSITORY)
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

	deleteBoardUsersByBoardList(
		teamBoardsIds: string[],
		withSession?: boolean
	): Promise<DeleteResult> {
		return this.boardUserRepository.deleteBoardUsersByBoardList(teamBoardsIds, withSession);
	}

	deleteBoardUsers(boardUsers: string[]): Promise<number> {
		return this.boardUserRepository.deleteBoardUsers(boardUsers);
	}

	startTransaction(): Promise<void> {
		return this.boardUserRepository.startTransaction();
	}

	commitTransaction(): Promise<void> {
		return this.boardUserRepository.commitTransaction();
	}

	abortTransaction(): Promise<void> {
		return this.boardUserRepository.abortTransaction();
	}

	endSession(): Promise<void> {
		return this.boardUserRepository.endSession();
	}
}

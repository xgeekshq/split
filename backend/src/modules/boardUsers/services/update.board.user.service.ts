import { Inject, Injectable } from '@nestjs/common';
import { BoardUserRepositoryInterface } from '../interfaces/repositories/board-user.repository.interface';
import { TYPES } from '../interfaces/types';
import { UpdateBoardUserServiceInterface } from '../interfaces/services/update.board.user.service.interface';
import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';

@Injectable()
export default class UpdateBoardUserService implements UpdateBoardUserServiceInterface {
	constructor(
		@Inject(TYPES.repositories.BoardUserRepository)
		private readonly boardUserRepository: BoardUserRepositoryInterface
	) {}

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

	updateManyUserVotes(
		boardId: string,
		usersWithVotes: Map<string, number>,
		withSession?: boolean,
		decrement?: false
	) {
		const arrayOperations = Array.from(usersWithVotes).map(([userId, votesCount]) => {
			return {
				updateOne: {
					filter: {
						user: userId,
						board: boardId
					},
					update: {
						$inc: { votesCount: decrement ? -votesCount : votesCount }
					}
				}
			};
		});

		return this.boardUserRepository.updateManyVoteUsers(arrayOperations, withSession);
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

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

	async updateBoardUserRole(boardId: string, userId: string, role: string): Promise<BoardUser> {
		return await this.boardUserRepository.updateBoardUserRole(boardId, userId, role);
	}

	async updateVoteUser(
		boardId: string,
		userId: string,
		count: number,
		withSession?: boolean,
		decrement?: boolean
	): Promise<BoardUser> {
		return await this.boardUserRepository.updateVoteUser(
			boardId,
			userId,
			count,
			withSession,
			decrement
		);
	}
}

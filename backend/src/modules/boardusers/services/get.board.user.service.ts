import { BoardUserRepositoryInterface } from 'src/modules/boardusers/interfaces/repositories/board-user.repository.interface';
import { GetBoardUserServiceInterface } from './../interfaces/services/get.board.user.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { PopulateType } from 'src/libs/repositories/interfaces/base.repository.interface';
import { SelectedValues } from 'src/libs/repositories/types';
import BoardUser from 'src/modules/boards/entities/board.user.schema';

@Injectable()
export default class GetBoardUserService implements GetBoardUserServiceInterface {
	constructor(
		@Inject(TYPES.repositories.BoardUserRepository)
		private readonly boardUserRepository: BoardUserRepositoryInterface
	) {}

	async getAllBoardsOfUser(userId: string): Promise<BoardUser[]> {
		return await this.boardUserRepository.getAllBoardsIdsOfUser(userId);
	}

	async getBoardResponsible(boardId: string): Promise<BoardUser> {
		return await this.boardUserRepository.getBoardResponsible(boardId);
	}

	async getVotesCount(boardId: string): Promise<BoardUser[]> {
		return await this.boardUserRepository.getVotesCount(boardId);
	}

	async getBoardUsers(board: string, user: string): Promise<BoardUser[]> {
		return await this.boardUserRepository.getBoardUsers(board, user);
	}

	async getBoardUser(
		board: string,
		user: string,
		select?: SelectedValues<BoardUser>,
		populate?: PopulateType
	): Promise<BoardUser> {
		return await this.getBoardUser(board, user, select, populate);
	}
}

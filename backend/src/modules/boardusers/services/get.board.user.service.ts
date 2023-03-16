import { BoardUserRepositoryInterface } from 'src/modules/boardusers/interfaces/repositories/board-user.repository.interface';
import { GetBoardUserServiceInterface } from './../interfaces/services/get.board.user.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import BoardUser from 'src/modules/boardusers/entities/board.user.schema';

@Injectable()
export default class GetBoardUserService implements GetBoardUserServiceInterface {
	constructor(
		@Inject(TYPES.repositories.BoardUserRepository)
		private readonly boardUserRepository: BoardUserRepositoryInterface
	) {}

	getAllBoardsOfUser(userId: string): Promise<BoardUser[]> {
		return this.boardUserRepository.getAllBoardsIdsOfUser(userId);
	}

	getBoardResponsible(boardId: string): Promise<BoardUser> {
		return this.boardUserRepository.getBoardResponsible(boardId);
	}

	getVotesCount(boardId: string): Promise<BoardUser[]> {
		return this.boardUserRepository.getVotesCount(boardId);
	}

	getBoardUser(board: string, user: string): Promise<BoardUser> {
		return this.boardUserRepository.getBoardUser(board, user);
	}

	getBoardUserPopulated(board: string, user: string): Promise<BoardUser> {
		return this.boardUserRepository.getBoardUserPopulated(board, user);
	}
}

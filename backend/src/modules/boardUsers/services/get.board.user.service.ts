import { BoardUserRepositoryInterface } from 'src/modules/boardUsers/interfaces/repositories/board-user.repository.interface';
import { GetBoardUserServiceInterface } from '../interfaces/services/get.board.user.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { BOARD_USER_REPOSITORY } from '../constants';
import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';

@Injectable()
export default class GetBoardUserService implements GetBoardUserServiceInterface {
	constructor(
		@Inject(BOARD_USER_REPOSITORY)
		private readonly boardUserRepository: BoardUserRepositoryInterface
	) {}

	// these functions are direct queries to the database so they won't be tested
	getAllBoardsOfUser(userId: string): Promise<BoardUser[]> {
		return this.boardUserRepository.getAllBoardsIdsOfUser(userId);
	}

	getAllBoardUsersOfBoard(boardId: string): Promise<BoardUser[]> {
		return this.boardUserRepository.getAllBoardUsersOfBoard(boardId);
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

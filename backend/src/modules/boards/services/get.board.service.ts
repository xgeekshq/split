import { GetBoardUserServiceInterface } from '../../boardUsers/interfaces/services/get.board.user.service.interface';
import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { BOARD_NOT_FOUND } from 'src/libs/exceptions/messages';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { QueryType } from '../interfaces/findQuery';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { cleanBoard } from '../utils/clean-board';
import { TYPES } from '../interfaces/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import UserDto from 'src/modules/users/dto/user.dto';
import { GET_TEAM_SERVICE } from 'src/modules/teams/constants';

@Injectable()
export default class GetBoardService implements GetBoardServiceInterface {
	constructor(
		@Inject(forwardRef(() => GET_TEAM_SERVICE))
		private getTeamService: GetTeamServiceInterface,
		@Inject(BoardUsers.TYPES.services.GetBoardUserService)
		private getBoardUserService: GetBoardUserServiceInterface,
		@Inject(TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface
	) {}

	async getAllBoardIdsAndTeamIdsOfUser(userId: string) {
		const [boardIds, teamIds] = await Promise.all([
			this.getBoardUserService.getAllBoardsOfUser(userId),
			this.getTeamService.getTeamsOfUser(userId)
		]);

		return {
			boardIds: boardIds.map((boardUser) => boardUser.board),
			teamIds: teamIds.map((team) => team._id)
		};
	}

	async getBoard(boardId: string, user: UserDto) {
		let board = await this.boardRepository.getBoardData(boardId);

		if (!board) throw new NotFoundException(BOARD_NOT_FOUND);

		board = cleanBoard(board, user._id);

		if (board.isSubBoard) {
			const mainBoard = await this.boardRepository.getMainBoard(boardId);

			if (!mainBoard) {
				throw new NotFoundException(BOARD_NOT_FOUND);
			}

			return { board, mainBoard };
		}

		return { board };
	}

	async countBoards(userId: string) {
		const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		return this.boardRepository.countBoards(boardIds, teamIds);
	}

	async isBoardPublic(boardId: string) {
		const board = await this.boardRepository.isBoardPublic(boardId);

		if (!board) {
			throw new NotFoundException(BOARD_NOT_FOUND);
		}

		return board.isPublic;
	}

	async getBoards(allBoards: boolean, query: QueryType, page = 0, size = 10) {
		const count = await this.boardRepository.getCountPage(query);

		const hasNextPage = page + 1 < Math.ceil(count / (allBoards ? count : size));

		const boards = await this.boardRepository.getAllBoards(allBoards, query, page, size, count);

		return { boards: boards ?? [], hasNextPage, page };
	}

	/* These functions are not being tested because they are calls to the board repository 
	Starts here */
	getBoardPopulated(boardId: string) {
		return this.boardRepository.getBoardPopulated(boardId);
	}

	getBoardById(boardId: string) {
		return this.boardRepository.getBoard(boardId);
	}

	getBoardData(boardId: string) {
		return this.boardRepository.getBoardData(boardId);
	}

	getBoardUser(board: string, user: string) {
		return this.getBoardUserService.getBoardUser(board, user);
	}

	getAllMainBoards() {
		return this.boardRepository.getAllMainBoards();
	}

	getBoardOwner(boardId: string) {
		return this.boardRepository.getBoardOwner(boardId);
	}
	/* Finishes here */
}

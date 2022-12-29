import { Inject, Injectable } from '@nestjs/common';
import { GetBoardApplicationInterface } from '../interfaces/applications/get.board.application.interface';
import { BoardsAndPage } from '../interfaces/boards-page.interface';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetBoardApplication implements GetBoardApplicationInterface {
	constructor(
		@Inject(TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}

	getUserBoardsOfLast3Months(
		userId: string,
		page?: number,
		size?: number
	): Promise<BoardsAndPage | null> {
		return this.getBoardService.getUserBoardsOfLast3Months(userId, page, size);
	}

	getAllBoards(
		teamId?: string,
		userId?: string,
		isSuperAdmin?: boolean,
		page?: number,
		size?: number
	) {
		if (teamId) return this.getBoardService.getTeamBoards(teamId, page, size);

		if (isSuperAdmin) return this.getBoardService.getSuperAdminBoards(userId, page, size);

		return this.getBoardService.getUsersBoards(userId, page, size);
	}

	getBoard(boardId: string, userId: string) {
		return this.getBoardService.getBoard(boardId, userId);
	}

	countBoards(userId: string) {
		return this.getBoardService.countBoards(userId);
	}

	getAllBoardIdsAndTeamIdsOfUser(userId: string) {
		return this.getBoardService.getAllBoardIdsAndTeamIdsOfUser(userId);
	}
}

import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { Inject, Injectable } from '@nestjs/common';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { TYPES } from '../interfaces/types';
import { BoardsAndPage } from '../interfaces/boards-page.interface';

export type GetBoardsForDashboardDto = { userId: string; page?: number; size?: number };

export type GetBoardsPaginatedPresenter = BoardsAndPage | null;

@Injectable()
export class GetBoardsForDashboardsUseCase
	implements UseCase<GetBoardsForDashboardDto, GetBoardsPaginatedPresenter>
{
	constructor(
		@Inject(TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}

	async execute({ userId, page, size }) {
		const { boardIds, teamIds } = await this.getBoardService.getAllBoardIdsAndTeamIdsOfUser(userId);

		const now = new Date();
		const last3Months = new Date().setMonth(now.getMonth() - 3);
		const query = {
			$and: [
				{ isSubBoard: false, updatedAt: { $gte: last3Months } },
				{ $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] }
			]
		};

		return this.getBoardService.getBoards(false, query, page, size);
	}
}

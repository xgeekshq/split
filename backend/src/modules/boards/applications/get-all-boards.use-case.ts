import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { Inject, Injectable } from '@nestjs/common';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { TYPES } from '../interfaces/types';
import { GetBoardsPaginatedPresenter } from './get-boards-for-dashboard.use-case';

export type GetAllBoardsUseCaseDto = {
	team?: string;
	userId?: string;
	isSAdmin?: boolean;
	page?: number;
	size?: number;
};

@Injectable()
export class GetAllBoardsUseCase
	implements UseCase<GetAllBoardsUseCaseDto, GetBoardsPaginatedPresenter>
{
	constructor(
		@Inject(TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}

	execute({ team, userId, isSAdmin, page, size }) {
		if (team) {
			return this.getTeamBoards(team, page, size);
		}

		if (isSAdmin) return this.getSuperAdminBoards(userId, page, size);

		return this.getBoardsOfUser(userId, page, size);
	}

	private async getSuperAdminBoards(userId: string, page: number, size?: number) {
		const { boardIds } = await this.getBoardService.getAllBoardIdsAndTeamIdsOfUser(userId);

		const query = {
			$and: [{ isSubBoard: false }, { $or: [{ _id: { $in: boardIds } }, { team: { $ne: null } }] }]
		};

		return this.getBoardService.getBoards(false, query, page, size);
	}

	private async getBoardsOfUser(userId: string, page: number, size?: number) {
		const { boardIds, teamIds } = await this.getBoardService.getAllBoardIdsAndTeamIdsOfUser(userId);

		const query = {
			$and: [
				{ isSubBoard: false },
				{ $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] }
			]
		};

		return this.getBoardService.getBoards(false, query, page, size);
	}

	private getTeamBoards(teamId: string, page: number, size?: number) {
		const query = {
			$and: [{ isSubBoard: false }, { $or: [{ team: teamId }] }]
		};

		return this.getBoardService.getBoards(false, query, page, size);
	}
}
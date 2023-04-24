import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import GetBoardsUseCaseDto from '../dto/useCase/get-boards.use-case.dto';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { GET_BOARD_SERVICE } from '../constants';
import BoardsPaginatedPresenter from '../presenter/boards-paginated.presenter';

@Injectable()
export class GetDashboardBoardsUseCase
	implements UseCase<GetBoardsUseCaseDto, BoardsPaginatedPresenter>
{
	constructor(
		@Inject(GET_BOARD_SERVICE)
		private readonly getBoardService: GetBoardServiceInterface
	) {}

	async execute({ userId, page, size }: GetBoardsUseCaseDto) {
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

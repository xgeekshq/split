import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { Inject, Injectable } from '@nestjs/common';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { TYPES } from '../interfaces/types';
import BoardsPaginatedPresenter from '../presenter/boards-paginated.presenter';
import GetBoardsUseCaseDto from '../dto/useCase/get-boards.use-case.dto';

@Injectable()
export class GetPersonalBoardsUseCase
	implements UseCase<GetBoardsUseCaseDto, BoardsPaginatedPresenter>
{
	constructor(
		@Inject(TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}

	async execute({ userId, page, size }) {
		const { boardIds } = await this.getBoardService.getAllBoardIdsAndTeamIdsOfUser(userId);

		const query = {
			$and: [{ isSubBoard: false }, { team: null }, { _id: { $in: boardIds } }]
		};

		return this.getBoardService.getBoards(false, query, page, size);
	}
}

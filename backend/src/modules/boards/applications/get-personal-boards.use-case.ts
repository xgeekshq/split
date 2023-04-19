import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import GetBoardsUseCaseDto from '../dto/useCase/get-boards.use-case.dto';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { TYPES } from '../types';
import BoardsPaginatedPresenter from '../presenter/boards-paginated.presenter';

@Injectable()
export class GetPersonalBoardsUseCase
	implements UseCase<GetBoardsUseCaseDto, BoardsPaginatedPresenter>
{
	constructor(
		@Inject(TYPES.services.GetBoardService)
		private readonly getBoardService: GetBoardServiceInterface
	) {}

	async execute({ userId, page, size }: GetBoardsUseCaseDto) {
		const { boardIds } = await this.getBoardService.getAllBoardIdsAndTeamIdsOfUser(userId);

		const query = {
			$and: [{ isSubBoard: false }, { team: null }, { _id: { $in: boardIds } }]
		};

		return this.getBoardService.getBoards(false, query, page, size);
	}
}

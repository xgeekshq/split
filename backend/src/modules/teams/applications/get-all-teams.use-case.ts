import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Team from '../entities/team.schema';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { TEAM_REPOSITORY } from '../constants';
import GetBoardService from 'src/modules/boards/services/get.board.service';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';

@Injectable()
export class GetAllTeamsUseCase implements UseCase<void, Team[]> {
	constructor(
		@Inject(TEAM_REPOSITORY)
		private readonly teamRepository: TeamRepositoryInterface,
		@Inject(GET_BOARD_SERVICE)
		private getBoardService: GetBoardService
	) {}

	async execute() {
		const teams = await this.teamRepository.getAllTeams();

		const allBoards = await this.getBoardService.getAllMainBoards();

		return teams.map((team) => {
			return {
				...team,
				boardsCount:
					allBoards.filter((board) => String(board.team) === String(team._id)).length ?? 0
			};
		});
	}
}

import { Inject, Injectable } from '@nestjs/common';
import * as User from 'src/modules/users/interfaces/types';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import { StatisticsAuthUserUseCaseInterface } from '../interfaces/applications/statistics.auth.use-case.interface';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';

@Injectable()
export default class StatisticsAuthUserUseCase implements StatisticsAuthUserUseCaseInterface {
	constructor(
		@Inject(User.TYPES.services.GetUserService)
		private readonly getUserService: GetUserServiceInterface,
		@Inject(GET_TEAM_USER_SERVICE)
		private readonly getTeamUserService: GetTeamUserServiceInterface,
		@Inject(GET_BOARD_SERVICE)
		private readonly getBoardService: GetBoardServiceInterface
	) {}

	public async execute(userId: string) {
		const [usersCount, teamsCount, boardsCount] = await Promise.all([
			this.getUserService.countUsers(),
			this.getTeamUserService.countTeamsOfUser(userId),
			this.getBoardService.countBoards(userId)
		]);

		return { usersCount, teamsCount, boardsCount };
	}
}

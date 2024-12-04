import { sortTeamUserListAlphabetically } from './../../users/utils/sortings';
import { TEAM_NOT_FOUND } from 'src/libs/exceptions/messages';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';
import Team from '../entities/team.schema';
import { TEAM_REPOSITORY } from '../constants';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';

@Injectable()
export default class GetTeamService implements GetTeamServiceInterface {
	constructor(
		@Inject(TEAM_REPOSITORY)
		private readonly teamRepository: TeamRepositoryInterface,
		@Inject(GET_TEAM_USER_SERVICE)
		private readonly getTeamUserService: GetTeamUserServiceInterface,
		@Inject(GET_BOARD_SERVICE)
		private readonly getBoardService: GetBoardServiceInterface
	) {}

	countAllTeams() {
		return this.teamRepository.countDocuments();
	}

	async getTeam(teamId: string) {
		const team = await this.teamRepository.getTeam(teamId);

		if (!team) throw new NotFoundException(TEAM_NOT_FOUND);

		team.users = sortTeamUserListAlphabetically(team.users);

		return team;
	}

	async getTeamsOfUser(userId: string) {
		const teamsOfUser = await this.getTeamUserService.getAllTeamsOfUser(userId);

		const teams: Team[] = await this.teamRepository.getTeamsWithUsers(
			teamsOfUser.map((teamUser) => teamUser._id)
		);

		const allBoards = await this.getBoardService.getAllMainBoards();

		const teamsResult = teams.map((team) => {
			return {
				...team,
				boardsCount:
					allBoards.filter((board) => String(board.team) === String(team._id)).length ?? 0
			};
		});

		return teamsResult.sort((a, b) => (a.name < b.name ? -1 : 1));
	}

	async getTeamByName(teamName: string) {
		const team = await this.teamRepository.getTeamByName(teamName);

		if (!team) {
			throw new NotFoundException(TEAM_NOT_FOUND);
		}

		return team;
	}
}

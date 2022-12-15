import { Inject, Injectable } from '@nestjs/common';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';
import Team from '../entities/teams.schema';
import { TYPES } from '../interfaces/types';
import { TeamRepositoryInterface } from '../repositories/team.repository.interface';
import { TeamUserRepositoryInterface } from '../repositories/team-user.repository.interface';
import User from 'src/modules/users/entities/user.schema';

@Injectable()
export default class GetTeamService implements GetTeamServiceInterface {
	constructor(
		@Inject(TYPES.repositories.TeamRepository)
		private readonly teamRepository: TeamRepositoryInterface,
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	countTeams(userId: string) {
		return this.teamUserRepository.countTeamsOfUser(userId);
	}

	countAllTeams() {
		return this.teamRepository.countDocuments();
	}

	getTeam(teamId: string) {
		return this.teamRepository.getTeam(teamId);
	}

	async getTeamsOfUser(userId: string) {
		const teamsUser = await this.teamUserRepository.getAllTeamsOfUser(userId);

		const teams: Team[] = await this.teamRepository.getTeamsWithUsers(
			teamsUser.map((teamUser) => teamUser._id)
		);

		return teams.map((team) => {
			return { ...team, boardsCount: team.boards?.length ?? 0, boards: undefined };
		});
	}

	getUsersOnlyWithTeams(users: User[]) {
		return this.teamUserRepository.getUsersOnlyWithTeams(users);
	}

	getTeamUser(userId: string, teamId: string) {
		return this.teamUserRepository.findOneByField({ user: userId, team: teamId });
	}

	getAllTeams() {
		return this.teamRepository.getAllTeams();
	}

	getUsersOfTeam(teamId: string) {
		return this.teamUserRepository.getUsersOfTeam(teamId);
	}
}

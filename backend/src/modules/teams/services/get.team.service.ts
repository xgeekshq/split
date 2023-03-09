import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';
import Team from '../entities/teams.schema';
import { TYPES } from '../interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import { TeamRepositoryInterface } from '../repositories/team.repository.interface';
import { TeamUserRepositoryInterface } from '../repositories/team-user.repository.interface';
import User from 'src/modules/users/entities/user.schema';
import UserDto from 'src/modules/users/dto/user.dto';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';

@Injectable()
export default class GetTeamService implements GetTeamServiceInterface {
	constructor(
		@Inject(TYPES.repositories.TeamRepository)
		private readonly teamRepository: TeamRepositoryInterface,
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface,
		@Inject(Boards.TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}

	countTeams(userId: string) {
		return this.teamUserRepository.countTeamsOfUser(userId);
	}

	countAllTeams() {
		return this.teamRepository.countDocuments();
	}

	async getTeam(teamId: string) {
		const team = await this.teamRepository.getTeam(teamId);

		team.users.sort((a, b) => {
			const userA = a.user as User;
			const userB = b.user as User;

			const fullNameA = `${userA?.firstName.toLowerCase()} ${userA?.lastName.toLowerCase()}`;
			const fullNameB = `${userB?.firstName.toLowerCase()} ${userB?.lastName.toLowerCase()}`;

			return fullNameA < fullNameB ? -1 : 1;
		});

		return team;
	}

	async getTeamsOfUser(userId: string) {
		const teamsUser = await this.teamUserRepository.getAllTeamsOfUser(userId);

		const teams: Team[] = await this.teamRepository.getTeamsWithUsers(
			teamsUser.map((teamUser) => teamUser._id)
		);

		const allBoards = await this.getBoardService.getAllMainBoards();

		const teamsResult = teams.map((team) => {
			return {
				...team,
				boardsCount:
					allBoards.filter((board) => String(board.team) === String(team._id)).length ?? 0
			};
		});

		return teamsResult;
	}

	getUsersOnlyWithTeams(users: User[]) {
		return this.teamUserRepository.getUsersOnlyWithTeams(users);
	}

	getTeamUser(userId: string, teamId: string) {
		return this.teamUserRepository.findOneByField({ user: userId, team: teamId });
	}

	async getAllTeams(user: UserDto) {
		if (!user.isSAdmin) throw new ForbiddenException();

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

	getUsersOfTeam(teamId: string) {
		return this.teamUserRepository.getUsersOfTeam(teamId);
	}

	async getTeamsUserIsNotMember(userId: string) {
		const allTeams = await this.teamRepository.getAllTeams();
		const teamUsers = await this.teamUserRepository.getAllTeamsOfUser(userId);

		if (teamUsers.length === 0) return allTeams;

		const teamsWithUsers: Team[] = await this.teamRepository.getTeamsWithUsers(
			teamUsers.map((teamUser) => teamUser._id)
		);

		//ID's of the teams the user IS member
		const teamsIds = teamsWithUsers.map((team) => team._id.toString());

		const teamsUserIsNotMember = allTeams.flatMap((team) => {
			if (teamsIds.includes(team._id.toString())) return [];

			const { name, _id } = team;

			return { name, _id };
		});

		return teamsUserIsNotMember;
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import { GetAllUsersWithTeamsUseCaseInterface } from '../interfaces/applications/get-all-users-with-teams.use-case.interface';
import { UserWithTeams } from '../interfaces/type-user-with-teams';
import { TYPES } from '../interfaces/types';
import * as Team from 'src/modules/teams/interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { sortAlphabetically } from '../utils/sortings';
import { GetUserServiceInterface } from '../interfaces/services/get.user.service.interface';

@Injectable()
export default class GetAllUsersWithTeamsUseCase implements GetAllUsersWithTeamsUseCaseInterface {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface,
		@Inject(TYPES.services.GetUserService)
		private readonly getUserService: GetUserServiceInterface,
		@Inject(Team.TYPES.services.GetTeamService)
		private getTeamService: GetTeamServiceInterface
	) {}

	async execute(page = 0, size = 15, searchUser?: string) {
		const users = await this.getAllUsersWithPagination(page, size, searchUser);

		const count = await this.getUserService.countUsers();
		const hasNextPage = page + 1 < Math.ceil(count / size);

		const mappedUsers: UserWithTeams[] = users.map((userFound) => {
			return {
				user: userFound,
				teamsNames: []
			};
		});
		const usersOnlyWithTeams = await this.getTeamService.getUsersOnlyWithTeams(users);

		const ids = new Set(usersOnlyWithTeams.map((userWithTeams) => String(userWithTeams.user._id)));

		const results = {
			userWithTeams: [
				...usersOnlyWithTeams,
				...mappedUsers.filter((user) => !ids.has(String(user.user._id)))
			],
			userAmount: count,
			hasNextPage,
			page
		};

		results.userWithTeams.sort((a, b) => sortAlphabetically(a.user, b.user));

		return results;
	}

	private getAllUsersWithPagination(page?: number, size?: number, searchUser?: string) {
		return this.userRepository.getAllWithPagination(page, size, searchUser);
	}
}

import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { GetAllUsersWithTeamsUseCaseInterface } from '../interfaces/applications/get-all-users-with-teams.use-case.interface';
import { UserWithTeams } from '../interfaces/type-user-with-teams';
import { TYPES } from '../interfaces/types';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
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
		@Inject(TeamUsers.TYPES.services.GetTeamUserService)
		private getTeamUserService: GetTeamUserServiceInterface
	) {}

	async execute(page = 0, size = 15, searchUser?: string) {
		const [users, count] = await Promise.all([
			this.getAllUsersWithPagination(page, size, searchUser),
			this.getUserService.countUsers()
		]);

		const hasNextPage = page + 1 < Math.ceil(count / size);

		const mappedUsers: UserWithTeams[] = users.map((userFound) => {
			return {
				user: userFound,
				teamsNames: []
			};
		});

		const usersOnlyWithTeams = await this.getTeamUserService.getUsersOnlyWithTeams(users);

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
		console.log(results.userWithTeams.map((users) => users));
		results.userWithTeams.sort((a, b) => sortAlphabetically(a.user, b.user));

		return results;
	}

	private getAllUsersWithPagination(page?: number, size?: number, searchUser?: string) {
		return this.userRepository.getAllWithPagination(page, size, searchUser);
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { compare } from 'src/libs/utils/bcrypt';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import * as Team from 'src/modules/teams/interfaces/types';
import { GetUserService } from '../interfaces/services/get.user.service.interface';
import { UserWithTeams } from '../interfaces/type-user-with-teams';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { sortAlphabetically } from '../utils/sortings';

@Injectable()
export default class GetUserServiceImpl implements GetUserService {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface,
		@Inject(Team.TYPES.services.GetTeamService)
		private getTeamService: GetTeamServiceInterface
	) {}

	getByEmail(email: string) {
		return this.userRepository.findOneByField({ email });
	}

	getById(_id: string) {
		return this.userRepository.getById(_id);
	}

	async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
		const user = await this.getById(userId);

		if (!user || !user.currentHashedRefreshToken) return false;

		const isRefreshTokenMatching = await compare(refreshToken, user.currentHashedRefreshToken);

		return isRefreshTokenMatching ? user : false;
	}

	countUsers() {
		return this.userRepository.countDocuments();
	}

	async getAllUsers() {
		return await this.userRepository.findAll(
			{
				password: 0,
				currentHashedRefreshToken: 0
			},
			{ firstName: 'asc', lastName: 'asc' }
		);
	}

	getAllUsersWithPagination(page?: number, size?: number, searchUser?: string) {
		return this.userRepository.getAllWithPagination(page, size, searchUser);
	}

	async getAllUsersWithTeams(page = 0, size = 15, searchUser?: string) {
		const users = await this.getAllUsersWithPagination(page, size, searchUser);

		const count = await this.userRepository.countDocuments();
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
			hasNextPage,
			page
		};

		results.userWithTeams.sort((a, b) => sortAlphabetically(a.user, b.user));

		return results;
	}
}

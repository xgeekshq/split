import { Inject, Injectable } from '@nestjs/common';
import { compare } from 'src/libs/utils/bcrypt';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import * as Team from 'src/modules/teams/interfaces/types';
import { GetUserService } from '../interfaces/services/get.user.service.interface';
import { UserWithTeams } from '../interfaces/type-user-with-teams';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';

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

	getAllUsers() {
		return this.userRepository.findAll({ password: 0, currentHashedRefreshToken: 0 });
	}

	getAllUsersWithPagination(page?: number, size?: number) {
		return this.userRepository.getAllWithPagination(page, size);
	}

	async getAllUsersWithTeams(page = 0, size = 10) {
		const users = await this.getAllUsersWithPagination(page, size);
		const mappedUsers: UserWithTeams[] = users.map((userFound) => {
			return {
				user: userFound,
				teams: []
			};
		});
		const usersOnlyWithTeams = await this.getTeamService.getUsersOnlyWithTeams(users);

		//return usersOnlyWithTeams;

		const ids = new Set(usersOnlyWithTeams.map((userWithTeams) => String(userWithTeams.user._id)));

		return [
			...usersOnlyWithTeams,
			...mappedUsers.filter((user) => !ids.has(String(user.user._id)))
		];
	}
}

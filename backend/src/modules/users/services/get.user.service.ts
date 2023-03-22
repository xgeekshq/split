import { GetTeamUserServiceInterface } from '../../teamUsers/interfaces/services/get.team.user.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { compare } from 'src/libs/utils/bcrypt';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import { GetUserServiceInterface } from '../interfaces/services/get.user.service.interface';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';

@Injectable()
export default class GetUserService implements GetUserServiceInterface {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface,
		@Inject(TeamUsers.TYPES.services.GetTeamUserService)
		private getTeamUserService: GetTeamUserServiceInterface
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
		return this.userRepository.getSignedUpUsersCount();
	}
}

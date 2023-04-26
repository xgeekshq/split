import { Inject, Injectable } from '@nestjs/common';
import { compare } from 'src/libs/utils/bcrypt';
import { GetUserServiceInterface } from '../interfaces/services/get.user.service.interface';
import { TYPES } from '../constants';
import { UserRepositoryInterface } from '../repository/user.repository.interface';

@Injectable()
export default class GetUserService implements GetUserServiceInterface {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface
	) {}

	async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
		const user = await this.getById(userId);

		if (!user || !user.currentHashedRefreshToken) return false;

		const isRefreshTokenMatching = await compare(refreshToken, user.currentHashedRefreshToken);

		return isRefreshTokenMatching ? user : false;
	}

	// these functions won't be tested since they make direct queries to the database
	getByEmail(email: string) {
		return this.userRepository.findOneByField({ email });
	}

	getById(_id: string) {
		return this.userRepository.getById(_id);
	}

	countUsers() {
		return this.userRepository.getSignedUpUsersCount();
	}
}

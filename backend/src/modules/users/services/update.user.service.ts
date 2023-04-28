import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { encrypt } from 'src/libs/utils/bcrypt';
import { UpdateUserServiceInterface } from '../interfaces/services/update.user.service.interface';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { PasswordsDontMatchException } from '../exceptions/passwordsDontMatchException';
import { UserNotFoundException } from '../../../libs/exceptions/userNotFoundException';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { VALIDATE_AUTH_SERVICE } from 'src/modules/auth/constants';
import { ValidateUserAuthServiceInterface } from 'src/modules/auth/interfaces/services/validate-user.auth.service.interface';

@Injectable()
export default class UpdateUserService implements UpdateUserServiceInterface {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface,
		@Inject(VALIDATE_AUTH_SERVICE)
		private readonly validateAuthService: ValidateUserAuthServiceInterface
	) {}

	async setPassword(userEmail: string, newPassword: string, newPasswordConf: string) {
		if (newPassword !== newPasswordConf) {
			throw new PasswordsDontMatchException();
		}

		const password = await encrypt(newPassword);
		const user = await this.userRepository.updateUserPassword(userEmail, password);

		if (!user) throw new BadRequestException(UPDATE_FAILED);

		return user;
	}

	async checkEmailOfToken(token: string) {
		const userFromDb = await this.validateAuthService.getUserByToken(token);

		if (!userFromDb) throw new UserNotFoundException();

		this.tokenValidator(userFromDb.updatedAt);

		const user = await this.userRepository.findOneByField({ email: userFromDb.emailAddress });

		if (!user) throw new UserNotFoundException();

		return user.email;
	}

	async updateUserAvatar(userId: string, avatarUrl: string) {
		const user = await this.userRepository.updateUserAvatar(userId, avatarUrl);

		if (!user) {
			throw new UpdateFailedException();
		}

		return user;
	}

	/* this block of functions won't be tested since they make direct queries to the database */
	async setCurrentRefreshToken(refreshToken: string, userId: string) {
		const currentHashedRefreshToken = await encrypt(refreshToken);

		return this.userRepository.updateUserWithRefreshToken(
			currentHashedRefreshToken,
			String(userId)
		);
	}

	async updateUserUpdatedAtField(user: string) {
		return await this.userRepository.updateUserUpdatedAt(user);
	}
	/* block ends here */

	/* --------- HELPERS --------- */

	private tokenValidator(updatedAt: Date) {
		const isTokenValid = (new Date().getTime() - updatedAt.getTime()) / 1000 / 60 < 15;

		if (!isTokenValid) {
			throw new HttpException('EXPIRED_TOKEN', HttpStatus.BAD_REQUEST);
		}
	}
}

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { encrypt } from 'src/libs/utils/bcrypt';
import * as ResetPassword from '../../auth/interfaces/types';
import { UpdateUserServiceInterface } from '../interfaces/services/update.user.service.interface';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { ResetPasswordRepositoryInterface } from 'src/modules/auth/repository/reset-password.repository.interface';
import { PasswordsDontMatchException } from '../exceptions/passwordsDontMatchException';
import { UserNotFoundException } from '../../../libs/exceptions/userNotFoundException';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';

@Injectable()
export default class UpdateUserService implements UpdateUserServiceInterface {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface,
		@Inject(ResetPassword.TYPES.repository.ResetPasswordRepository)
		private readonly resetPasswordRepository: ResetPasswordRepositoryInterface
	) {}

	async setCurrentRefreshToken(refreshToken: string, userId: string) {
		const currentHashedRefreshToken = await encrypt(refreshToken);

		return this.userRepository.updateUserWithRefreshToken(
			currentHashedRefreshToken,
			String(userId)
		);
	}

	async setPassword(userEmail: string, newPassword: string, newPasswordConf: string) {
		const password = await encrypt(newPassword);

		if (newPassword !== newPasswordConf) {
			throw new PasswordsDontMatchException();
		}

		const user = await this.userRepository.updateUserPassword(userEmail, password);

		if (!user) throw new UserNotFoundException();

		return user;
	}

	async checkEmailOfToken(token: string) {
		const userFromDb = await this.resetPasswordRepository.findOneByField({ token });

		if (!userFromDb) throw new UserNotFoundException();

		this.tokenValidator(userFromDb.updatedAt);

		const user = await this.userRepository.findOneByField({ email: userFromDb.emailAddress });

		if (!user) throw new UserNotFoundException();

		return user.email;
	}

	public tokenValidator(updatedAt: Date) {
		const isTokenValid = (new Date().getTime() - updatedAt.getTime()) / 1000 / 60 < 15;

		if (!isTokenValid) {
			throw new HttpException('EXPIRED_TOKEN', HttpStatus.BAD_REQUEST);
		}
	}

	async updateUserAvatar(userId: string, avatarUrl: string) {
		const user = await this.userRepository.updateUserAvatar(userId, avatarUrl);

		if (!user) {
			throw new UpdateFailedException();
		}

		return user;
	}

	async updateUserUpdatedAtField(user: string) {
		return await this.userRepository.updateUserUpdatedAt(user);
	}
}

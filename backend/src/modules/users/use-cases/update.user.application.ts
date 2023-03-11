import { Inject, Injectable } from '@nestjs/common';
import UpdateUserDto from '../dto/update.user.dto';
import UserDto from '../dto/user.dto';
import { UpdateUserApplicationInterface } from '../interfaces/use-cases/update.user.service.interface';
import { UpdateUserServiceInterface } from '../interfaces/services/update.user.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class UpdateUserApplication implements UpdateUserApplicationInterface {
	constructor(
		@Inject(TYPES.services.UpdateUserService)
		private updateUserService: UpdateUserServiceInterface
	) {}

	setCurrentRefreshToken(refreshToken: string, userId: string) {
		return this.updateUserService.setCurrentRefreshToken(refreshToken, userId);
	}

	setPassword(userEmail: string, newPassword: string, newPasswordConf: string) {
		return this.updateUserService.setPassword(userEmail, newPassword, newPasswordConf);
	}

	checkEmail(token: string) {
		return this.updateUserService.checkEmail(token);
	}

	updateSuperAdmin(user: UpdateUserDto, requestUser: UserDto) {
		return this.updateUserService.updateSuperAdmin(user, requestUser);
	}
}

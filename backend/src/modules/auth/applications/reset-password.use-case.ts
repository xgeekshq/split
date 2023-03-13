import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { TYPES } from 'src/modules/users/interfaces/types';
import { ResetPasswordUseCaseInterface } from '../interfaces/applications/reset-password.use-case.interface';
import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';

@Injectable()
export default class ResetPasswordUseCase implements ResetPasswordUseCaseInterface {
	constructor(
		@Inject(TYPES.services.UpdateUserService)
		private readonly updateUserService: UpdateUserServiceInterface
	) {}

	async execute(token: string, newPassword: string, newPasswordConf: string) {
		const email = await this.updateUserService.checkEmailOfToken(token);

		if (!email) {
			throw new UnauthorizedException('Invalid token!');
		}

		const result = await this.updateUserService.setPassword(email, newPassword, newPasswordConf);

		if (!result) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		return {
			status: 'ok',
			message: 'Password updated successfully!'
		};
	}
}

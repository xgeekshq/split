import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UPDATE_USER_SERVICE } from 'src/modules/users/constants';
import { ResetPasswordUseCaseInterface } from '../interfaces/applications/reset-password.use-case.interface';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import { InvalidTokenException } from '../exceptions/invalidTokenException';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';

@Injectable()
export default class ResetPasswordUseCase implements ResetPasswordUseCaseInterface {
	constructor(
		@Inject(UPDATE_USER_SERVICE)
		private readonly updateUserService: UpdateUserServiceInterface
	) {}

	async execute(token: string, newPassword: string, newPasswordConf: string) {
		const email = await this.updateUserService.checkEmailOfToken(token);

		if (!email) {
			throw new InvalidTokenException();
		}

		const result = await this.updateUserService.setPassword(email, newPassword, newPasswordConf);

		if (!result) {
			throw new UpdateFailedException(UPDATE_FAILED);
		}

		return {
			status: 'ok',
			message: 'Password updated successfully!'
		};
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from 'src/modules/users/interfaces/types';
import { ValidateUserEmailUseCaseInterface } from '../interfaces/applications/validate-email.use-case.interface';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';

@Injectable()
export default class ValidateUserEmailUseCase implements ValidateUserEmailUseCaseInterface {
	constructor(
		@Inject(TYPES.services.GetUserService)
		private readonly getUserService: GetUserServiceInterface
	) {}

	async execute(email: string) {
		const user = await this.getUserService.getByEmail(email);

		return !!user;
	}
}

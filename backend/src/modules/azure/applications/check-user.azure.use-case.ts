import { Inject, Injectable } from '@nestjs/common';
import { AuthAzureServiceInterface } from '../interfaces/services/auth.azure.service.interface';
import { TYPES } from '../interfaces/types';
import * as UserType from 'src/modules/users/interfaces/types';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import { CheckUserAzureUseCaseInterface } from '../interfaces/applications/check-user.azure.use-case.interface';
import { UserNotFoundException } from 'src/libs/exceptions/userNotFoundException';

@Injectable()
export class CheckUserAzureUseCase implements CheckUserAzureUseCaseInterface {
	constructor(
		@Inject(TYPES.services.AuthAzureService)
		private authAzureService: AuthAzureServiceInterface,
		@Inject(UserType.TYPES.services.GetUserService)
		private readonly getUserService: GetUserServiceInterface
	) {}

	async execute(email: string) {
		const existUserInAzure = await this.authAzureService.getUserFromAzure(email);

		if (existUserInAzure) {
			return 'az';
		}

		const existUserInDB = await this.getUserService.getByEmail(email);

		if (existUserInDB) {
			return 'local';
		}

		throw new UserNotFoundException();
	}
}

import { GetTokenAuthServiceInterface } from 'src/modules/auth/interfaces/services/get-token.auth.service.interface';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { TYPES } from 'src/modules/users/interfaces/types';
import * as AUTH_TYPES from 'src/modules/auth/interfaces/types';
import CreateGuestUserDto from 'src/modules/users/dto/create.guest.user.dto';
import { RegisterGuestUserUseCaseInterface } from '../interfaces/applications/register-guest-user.use-case.interface';

@Injectable()
export default class RegisterGuestUserUseCase implements RegisterGuestUserUseCaseInterface {
	constructor(
		@Inject(TYPES.services.CreateUserService)
		private createUserService: CreateUserServiceInterface,
		@Inject(AUTH_TYPES.TYPES.services.GetTokenAuthService)
		private getTokenAuthService: GetTokenAuthServiceInterface
	) {}

	public async execute(guestUserData: CreateGuestUserDto) {
		const guestUserCreated = await this.createUserService.createGuest(guestUserData);

		if (!guestUserCreated) throw new BadRequestException(INSERT_FAILED);

		const { accessToken } = await this.getTokenAuthService.getTokens(guestUserCreated._id);

		return { accessToken, user: guestUserCreated._id };
	}
}

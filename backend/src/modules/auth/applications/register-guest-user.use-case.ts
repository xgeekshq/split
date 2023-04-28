import { GetTokenAuthServiceInterface } from 'src/modules/auth/interfaces/services/get-token.auth.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { TYPES } from 'src/modules/users/interfaces/types';
import CreateGuestUserDto from 'src/modules/users/dto/create.guest.user.dto';
import { RegisterGuestUserUseCaseInterface } from '../interfaces/applications/register-guest-user.use-case.interface';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { GET_TOKEN_AUTH_SERVICE } from 'src/modules/auth/constants';

@Injectable()
export default class RegisterGuestUserUseCase implements RegisterGuestUserUseCaseInterface {
	constructor(
		@Inject(TYPES.services.CreateUserService)
		private readonly createUserService: CreateUserServiceInterface,
		@Inject(GET_TOKEN_AUTH_SERVICE)
		private readonly getTokenAuthService: GetTokenAuthServiceInterface
	) {}

	public async execute(guestUserData: CreateGuestUserDto) {
		const guestUserCreated = await this.createUserService.createGuest(guestUserData);

		if (!guestUserCreated) throw new InsertFailedException();

		const { accessToken } = await this.getTokenAuthService.getTokens(guestUserCreated._id);

		return { accessToken, user: guestUserCreated._id };
	}
}

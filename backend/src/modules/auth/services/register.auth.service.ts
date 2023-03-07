import { GetTokenAuthServiceInterface } from 'src/modules/auth/interfaces/services/get-token.auth.service.interface';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { encrypt } from 'src/libs/utils/bcrypt';
import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import { CreateUserService } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { TYPES } from 'src/modules/users/interfaces/types';
import * as AUTH_TYPES from 'src/modules/auth/interfaces/types';
import { RegisterAuthServiceInterface } from '../interfaces/services/register.auth.service.interface';
import CreateGuestUserDto from 'src/modules/users/dto/create.guest.user.dto';

@Injectable()
export default class RegisterAuthService implements RegisterAuthServiceInterface {
	constructor(
		@Inject(TYPES.services.CreateUserService)
		private createUserService: CreateUserService,
		@Inject(AUTH_TYPES.TYPES.services.GetTokenAuthService)
		private getTokenAuthService: GetTokenAuthServiceInterface
	) {}

	public async register(registrationData: CreateUserDto) {
		const hashedPassword = await encrypt(registrationData.password);

		return this.createUserService.create({
			...registrationData,
			password: hashedPassword
		});
	}

	public async createGuest(guestUserData: CreateGuestUserDto) {
		const guestUserCreated = await this.createUserService.createGuest(guestUserData);

		if (!guestUserCreated) throw new BadRequestException(INSERT_FAILED);

		const { accessToken } = await this.getTokenAuthService.getTokens(guestUserCreated._id);

		return { accessToken, user: guestUserCreated._id };
	}
}

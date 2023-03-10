import CreateGuestUserDto from 'src/modules/users/dto/create.guest.user.dto';
import { Inject, Injectable } from '@nestjs/common';
import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import { RegisterAuthApplicationInterface } from '../interfaces/applications/register.auth.application.interface';
import { RegisterAuthServiceInterface } from '../interfaces/services/register.auth.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class RegisterAuthApplication implements RegisterAuthApplicationInterface {
	constructor(
		@Inject(TYPES.services.RegisterAuthService)
		private registerAuthService: RegisterAuthServiceInterface
	) {}

	register(registrationData: CreateUserDto) {
		return this.registerAuthService.register(registrationData);
	}

	createGuestUser(guestUserData: CreateGuestUserDto) {
		return this.registerAuthService.createGuest(guestUserData);
	}
}

import { Inject, Injectable } from '@nestjs/common';
import UserDto from 'src/modules/users/dto/user.dto';
import { TYPES } from '../interfaces/types';
import { GetTokenAuthServiceInterface } from '../interfaces/services/get-token.auth.service.interface';
import { signIn } from '../shared/login.auth';
import { SignInUseCaseInterface } from '../interfaces/applications/signIn.use-case.interface';
import { UserNotFoundException } from 'src/libs/exceptions/userNotFoundException';

@Injectable()
export default class SignInUseCase implements SignInUseCaseInterface {
	constructor(
		@Inject(TYPES.services.GetTokenAuthService)
		private getTokenAuthService: GetTokenAuthServiceInterface
	) {}

	public async execute(user: UserDto) {
		const loggedUser = await signIn(user, this.getTokenAuthService, 'local');

		if (!loggedUser) {
			throw new UserNotFoundException();
		}

		return loggedUser;
	}
}

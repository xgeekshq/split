import { Inject, Injectable } from '@nestjs/common';
import { RefreshTokenUseCaseInterface } from '../interfaces/applications/refresh-token.use-case.interface';
import { GET_TOKEN_AUTH_SERVICE } from '../constants';
import { GetTokenAuthServiceInterface } from '../interfaces/services/get-token.auth.service.interface';

@Injectable()
export default class RefreshTokenUseCase implements RefreshTokenUseCaseInterface {
	constructor(
		@Inject(GET_TOKEN_AUTH_SERVICE)
		private readonly getTokenService: GetTokenAuthServiceInterface
	) {}

	execute(userId: string) {
		return this.getTokenService.getAccessToken(userId);
	}
}

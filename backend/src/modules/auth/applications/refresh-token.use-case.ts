import { Inject, Injectable } from '@nestjs/common';
import { RefreshTokenUseCaseInterface } from '../interfaces/applications/refresh-token.use-case.interface';
import { TYPES } from '../interfaces/types';
import { GetTokenAuthServiceInterface } from '../interfaces/services/get-token.auth.service.interface';

@Injectable()
export default class RefreshTokenUseCase implements RefreshTokenUseCaseInterface {
	constructor(
		@Inject(TYPES.services.GetTokenAuthService)
		private readonly getTokenService: GetTokenAuthServiceInterface
	) {}

	execute(userId: string) {
		return this.getTokenService.getAccessToken(userId);
	}
}

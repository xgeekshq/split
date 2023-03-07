import { Inject, Injectable } from '@nestjs/common';
import { GetTokenAuthApplication } from '../interfaces/applications/get-token.auth.application.interface';
import { GetTokenAuthServiceInterface } from '../interfaces/services/get-token.auth.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetTokenAuthApplicationImpl implements GetTokenAuthApplication {
	constructor(
		@Inject(TYPES.services.GetTokenAuthService)
		private getTokenAuthService: GetTokenAuthServiceInterface
	) {}

	getTokens(userId: string) {
		return this.getTokenAuthService.getTokens(userId);
	}

	getAccessToken(userId: string) {
		return this.getTokenAuthService.getAccessToken(userId);
	}
}

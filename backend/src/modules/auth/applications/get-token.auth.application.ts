import { Inject, Injectable } from '@nestjs/common';
import { GetTokenAuthApplicationInterface } from '../interfaces/applications/get-token.auth.application.interface';
import { GetTokenAuthServiceInterface } from '../interfaces/services/get-token.auth.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetTokenAuthApplication implements GetTokenAuthApplicationInterface {
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

import { Inject, Injectable } from '@nestjs/common';
import { AuthAzureApplicationInterface } from '../interfaces/applications/auth.azure.application.interface';
import { AuthAzureServiceInterface } from '../interfaces/services/auth.azure.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class AuthAzureApplication implements AuthAzureApplicationInterface {
	constructor(
		@Inject(TYPES.services.AuthAzureService)
		private authAzureService: AuthAzureServiceInterface
	) {}

	registerOrLogin(azureToken: string) {
		return this.authAzureService.loginOrRegisterAzureToken(azureToken);
	}

	checkUserExistsInActiveDirectory(email: string) {
		return this.authAzureService.checkUserExistsInActiveDirectory(email);
	}
}

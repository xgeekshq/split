import { AuthAzureApplication } from './applications/auth.azure.application';
import { TYPES } from './interfaces/types';
import AuthAzureService from './services/auth.azure.service';

export const authAzureService = {
	provide: TYPES.services.AuthAzureService,
	useClass: AuthAzureService
};

export const authAzureApplication = {
	provide: TYPES.applications.AuthAzureApplication,
	useClass: AuthAzureApplication
};

import { AuthAzureApplicationImpl } from './applications/auth.azure.application';
import { TYPES } from './interfaces/types';
import AuthAzureServiceImpl from './services/auth.azure.service';

export const authAzureService = {
	provide: TYPES.services.AuthAzureService,
	useClass: AuthAzureServiceImpl
};

export const authAzureApplication = {
	provide: TYPES.applications.AuthAzureApplication,
	useClass: AuthAzureApplicationImpl
};

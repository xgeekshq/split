import { CheckUserAzureUseCase } from './applications/check-user.azure.use-case';
import { RegisterOrLoginAzureUseCase } from './applications/register-or-login.azure.use-case';
import { TYPES } from './interfaces/types';
import AuthAzureService from './services/auth.azure.service';

export const authAzureService = {
	provide: TYPES.services.AuthAzureService,
	useClass: AuthAzureService
};

export const checkUserUseCase = {
	provide: TYPES.applications.CheckUserUseCase,
	useClass: CheckUserAzureUseCase
};

export const registerOrLoginUseCase = {
	provide: TYPES.applications.RegisterOrLoginUseCase,
	useClass: RegisterOrLoginAzureUseCase
};

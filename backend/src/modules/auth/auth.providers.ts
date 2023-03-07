import { CreateResetTokenAuthApplicationImpl } from './applications/create-reset-token.auth.application';
import { GetTokenAuthApplicationImpl } from './applications/get-token.auth.application';
import { RegisterAuthApplicationImpl } from './applications/register.auth.application';
import { TYPES } from './interfaces/types';
import CreateResetTokenAuthService from './services/create-reset-token.auth.service';
import GetTokenAuthService from './services/get-token.auth.service';
import RegisterAuthService from './services/register.auth.service';
import ValidateUserAuthService from './services/validate-user.auth.service';

export const getTokenAuthService = {
	provide: TYPES.services.GetTokenAuthService,
	useClass: GetTokenAuthService
};

export const registerAuthService = {
	provide: TYPES.services.RegisterAuthService,
	useClass: RegisterAuthService
};

export const validateUserAuthService = {
	provide: TYPES.services.ValidateAuthService,
	useClass: ValidateUserAuthService
};

export const createResetTokenAuthService = {
	provide: TYPES.services.CreateResetTokenAuthService,
	useClass: CreateResetTokenAuthService
};

export const getTokenAuthApplication = {
	provide: TYPES.applications.GetTokenAuthApplication,
	useClass: GetTokenAuthApplicationImpl
};

export const registerAuthApplication = {
	provide: TYPES.applications.RegisterAuthApplication,
	useClass: RegisterAuthApplicationImpl
};

export const createResetTokenAuthApplication = {
	provide: TYPES.applications.CreateResetTokenAuthApplication,
	useClass: CreateResetTokenAuthApplicationImpl
};

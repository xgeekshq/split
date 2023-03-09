import { CreateResetTokenAuthApplication } from './applications/create-reset-token.auth.application';
import { GetTokenAuthApplication } from './applications/get-token.auth.application';
import { RegisterAuthApplication } from './applications/register.auth.application';
import { TYPES } from './interfaces/types';
import { ResetPasswordRepository } from './repository/reset-password.repository';
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
	useClass: GetTokenAuthApplication
};

export const registerAuthApplication = {
	provide: TYPES.applications.RegisterAuthApplication,
	useClass: RegisterAuthApplication
};

export const createResetTokenAuthApplication = {
	provide: TYPES.applications.CreateResetTokenAuthApplication,
	useClass: CreateResetTokenAuthApplication
};

export const resetPasswordRepository = {
	provide: TYPES.repository.ResetPasswordRepository,
	useClass: ResetPasswordRepository
};

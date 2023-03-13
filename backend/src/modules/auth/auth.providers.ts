import { CreateResetTokenAuthApplication } from './applications/create-reset-token.auth.application';
import { GetTokenAuthApplication } from './applications/get-token.auth.application';
import RegisterGuestUserUseCase from './applications/register-guest-user.use-case';
import RegisterUserUseCase from './applications/register-user.use-case';
import SignInUseCase from './applications/signIn.use-case';
import StatisticsAuthUserUseCase from './applications/statistics.auth.application';
import ValidateUserEmailUseCase from './applications/validate-user-email.use-case';
import { TYPES } from './interfaces/types';
import { ResetPasswordRepository } from './repository/reset-password.repository';
import CreateResetTokenAuthService from './services/create-reset-token.auth.service';
import GetTokenAuthService from './services/get-token.auth.service';
import RegisterAuthService from './services/register.auth.service';

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
	useClass: ValidateUserEmailUseCase
};

export const createResetTokenAuthService = {
	provide: TYPES.services.CreateResetTokenAuthService,
	useClass: CreateResetTokenAuthService
};

export const getTokenAuthApplication = {
	provide: TYPES.applications.GetTokenAuthApplication,
	useClass: GetTokenAuthApplication
};

export const registerUserUseCase = {
	provide: TYPES.applications.RegisterUserUseCase,
	useClass: RegisterUserUseCase
};

export const signInUseCase = {
	provide: TYPES.applications.SignInUseCase,
	useClass: SignInUseCase
};

export const registerGuestUserUseCase = {
	provide: TYPES.applications.RegisterGuestUserUseCase,
	useClass: RegisterGuestUserUseCase
};

export const statisticsAuthUserUseCase = {
	provide: TYPES.applications.StatisticsAuthUserUseCase,
	useClass: StatisticsAuthUserUseCase
};

export const validateUserEmailUseCase = {
	provide: TYPES.applications.ValidateUserEmailUseCase,
	useClass: ValidateUserEmailUseCase
};

export const createResetTokenAuthApplication = {
	provide: TYPES.applications.CreateResetTokenAuthApplication,
	useClass: CreateResetTokenAuthApplication
};

export const resetPasswordRepository = {
	provide: TYPES.repository.ResetPasswordRepository,
	useClass: ResetPasswordRepository
};

import { CreateResetPasswordTokenUseCase } from './applications/create-reset-password-token.use-case';
import RefreshTokenUseCase from './applications/refresh-token.use-case';
import RegisterGuestUserUseCase from './applications/register-guest-user.use-case';
import RegisterUserUseCase from './applications/register-user.use-case';
import ResetPasswordUseCase from './applications/reset-password.use-case';
import SignInUseCase from './applications/signIn.use-case';
import StatisticsAuthUserUseCase from './applications/statistics.auth.use-case';
import ValidateUserEmailUseCase from './applications/validate-user-email.use-case';
import { TYPES } from './interfaces/types';
import { ResetPasswordRepository } from './repository/reset-password.repository';
import GetTokenAuthService from './services/get-token.auth.service';
import ValidateUserAuthService from './services/validate-user.auth.service';

export const getTokenAuthService = {
	provide: TYPES.services.GetTokenAuthService,
	useClass: GetTokenAuthService
};

export const validateUserAuthService = {
	provide: TYPES.services.ValidateAuthService,
	useClass: ValidateUserAuthService
};

export const registerUserUseCase = {
	provide: TYPES.applications.RegisterUserUseCase,
	useClass: RegisterUserUseCase
};

export const signInUseCase = {
	provide: TYPES.applications.SignInUseCase,
	useClass: SignInUseCase
};

export const refreshTokenUseCase = {
	provide: TYPES.applications.RefreshTokenUseCase,
	useClass: RefreshTokenUseCase
};

export const registerGuestUserUseCase = {
	provide: TYPES.applications.RegisterGuestUserUseCase,
	useClass: RegisterGuestUserUseCase
};

export const statisticsAuthUserUseCase = {
	provide: TYPES.applications.StatisticsAuthUserUseCase,
	useClass: StatisticsAuthUserUseCase
};

export const resetPasswordUseCase = {
	provide: TYPES.applications.ResetPasswordUseCase,
	useClass: ResetPasswordUseCase
};

export const validateUserEmailUseCase = {
	provide: TYPES.applications.ValidateUserEmailUseCase,
	useClass: ValidateUserEmailUseCase
};

export const createResetPasswordTokenUseCase = {
	provide: TYPES.applications.CreateResetPasswordTokenUseCase,
	useClass: CreateResetPasswordTokenUseCase
};

export const resetPasswordRepository = {
	provide: TYPES.repository.ResetPasswordRepository,
	useClass: ResetPasswordRepository
};

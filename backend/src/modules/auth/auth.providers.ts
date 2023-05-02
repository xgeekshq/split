import { CreateResetPasswordTokenUseCase } from './applications/create-reset-password-token.use-case';
import RefreshTokenUseCase from './applications/refresh-token.use-case';
import RegisterGuestUserUseCase from './applications/register-guest-user.use-case';
import RegisterUserUseCase from './applications/register-user.use-case';
import ResetPasswordUseCase from './applications/reset-password.use-case';
import SignInUseCase from './applications/signIn.use-case';
import StatisticsAuthUserUseCase from './applications/statistics.auth.use-case';
import ValidateUserEmailUseCase from './applications/validate-user-email.use-case';
import {
	CREATE_RESET_PASSWORD_TOKEN_USE_CASE,
	GET_TOKEN_AUTH_SERVICE,
	REFRESH_TOKEN_USE_CASE,
	REGISTER_GUEST_USER_USE_CASE,
	REGISTER_USER_USE_CASE,
	RESET_PASSWORD_REPOSITORY,
	RESET_PASSWORD_USE_CASE,
	SIGN_IN_USE_CASE,
	STATISTICS_AUTH_USER_USE_CASE,
	VALIDATE_AUTH_SERVICE,
	VALIDATE_USER_EMAIL_USE_CASE
} from './constants';
import { ResetPasswordRepository } from './repository/reset-password.repository';
import GetTokenAuthService from './services/get-token.auth.service';
import ValidateUserAuthService from './services/validate-user.auth.service';

/* SERVICES */

export const getTokenAuthService = {
	provide: GET_TOKEN_AUTH_SERVICE,
	useClass: GetTokenAuthService
};

export const validateUserAuthService = {
	provide: VALIDATE_AUTH_SERVICE,
	useClass: ValidateUserAuthService
};

/* USE CASES */

export const registerUserUseCase = {
	provide: REGISTER_USER_USE_CASE,
	useClass: RegisterUserUseCase
};

export const signInUseCase = {
	provide: SIGN_IN_USE_CASE,
	useClass: SignInUseCase
};

export const refreshTokenUseCase = {
	provide: REFRESH_TOKEN_USE_CASE,
	useClass: RefreshTokenUseCase
};

export const registerGuestUserUseCase = {
	provide: REGISTER_GUEST_USER_USE_CASE,
	useClass: RegisterGuestUserUseCase
};

export const statisticsAuthUserUseCase = {
	provide: STATISTICS_AUTH_USER_USE_CASE,
	useClass: StatisticsAuthUserUseCase
};

export const resetPasswordUseCase = {
	provide: RESET_PASSWORD_USE_CASE,
	useClass: ResetPasswordUseCase
};

export const validateUserEmailUseCase = {
	provide: VALIDATE_USER_EMAIL_USE_CASE,
	useClass: ValidateUserEmailUseCase
};

export const createResetPasswordTokenUseCase = {
	provide: CREATE_RESET_PASSWORD_TOKEN_USE_CASE,
	useClass: CreateResetPasswordTokenUseCase
};

/* REPOSITORY */

export const resetPasswordRepository = {
	provide: RESET_PASSWORD_REPOSITORY,
	useClass: ResetPasswordRepository
};

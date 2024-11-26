import { CheckUserAzureUseCase } from './applications/check-user.azure.use-case';
import { RegisterOrLoginAzureUseCase } from './applications/register-or-login.azure.use-case';
import {
	AUTH_AZURE_SERVICE,
	CHECK_USER_USE_CASE,
	REGISTER_OR_LOGIN_USE_CASE,
	SYNCHRONIZE_AD_USERS_CRON_USE_CASE
} from './constants';
import { SynchronizeADUsersCronUseCase } from './schedules/synchronize-ad-users.cron.azure.use-case';
import AuthAzureService from './services/auth.azure.service';

/* SERVICE */

export const authAzureService = {
	provide: AUTH_AZURE_SERVICE,
	useClass: AuthAzureService
};

/* USE CASES */

export const checkUserUseCase = {
	provide: CHECK_USER_USE_CASE,
	useClass: CheckUserAzureUseCase
};

export const registerOrLoginUseCase = {
	provide: REGISTER_OR_LOGIN_USE_CASE,
	useClass: RegisterOrLoginAzureUseCase
};

export const synchronizeADUsersCronUseCase = {
	provide: SYNCHRONIZE_AD_USERS_CRON_USE_CASE,
	useClass: SynchronizeADUsersCronUseCase
};

import { GetTokenAuthApplicationImpl } from './applications/get-token.auth.application';
import { RegisterAuthApplicationImpl } from './applications/register.auth.application';
import { TYPES } from './interfaces/types';
import AzureAuthServiceImpl from '../azure/services/cron.azure.service';
import GetTokenAuthServiceImpl from './services/get-token.auth.service';
import RegisterAuthServiceImpl from './services/register.auth.service';
import ValidateUserAuthServiceImpl from './services/validate-user.auth.service';

export const getTokenAuthService = {
  provide: TYPES.services.GetTokenAuthService,
  useClass: GetTokenAuthServiceImpl,
};
export const registerAuthService = {
  provide: TYPES.services.RegisterAuthService,
  useClass: RegisterAuthServiceImpl,
};

export const validateUserAuthService = {
  provide: TYPES.services.ValidateAuthService,
  useClass: ValidateUserAuthServiceImpl,
};

export const azureAuthService = {
  provide: TYPES.services.AzureAuthService,
  useClass: AzureAuthServiceImpl,
};

export const getTokenAuthApplication = {
  provide: TYPES.applications.GetTokenAuthApplication,
  useClass: GetTokenAuthApplicationImpl,
};

export const registerAuthApplication = {
  provide: TYPES.applications.RegisterAuthApplication,
  useClass: RegisterAuthApplicationImpl,
};

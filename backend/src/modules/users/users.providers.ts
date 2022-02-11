import { TYPES } from './interfaces/types';
import CreateUserServiceImpl from './services/create.user.service';
import GetUserServiceImpl from './services/get.user.service';
import UpdateUserServiceImpl from './services/update.user.service';

export const createUserService = {
  provide: TYPES.services.CreateUserService,
  useClass: CreateUserServiceImpl,
};
export const getUserService = {
  provide: TYPES.services.GetUserService,
  useClass: GetUserServiceImpl,
};
export const updateUserService = {
  provide: TYPES.services.UpdateUserService,
  useClass: UpdateUserServiceImpl,
};

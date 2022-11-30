import { GetUserApplicationImpl } from './applications/get.user.application';
import { UpdateUserApplicationImpl } from './applications/update.user.application';
import { TYPES } from './interfaces/types';
import { UserRepository } from './repository/user.repository';
import CreateUserServiceImpl from './services/create.user.service';
import GetUserServiceImpl from './services/get.user.service';
import UpdateUserServiceImpl from './services/update.user.service';

export const createUserService = {
	provide: TYPES.services.CreateUserService,
	useClass: CreateUserServiceImpl
};

export const getUserService = {
	provide: TYPES.services.GetUserService,
	useClass: GetUserServiceImpl
};

export const updateUserService = {
	provide: TYPES.services.UpdateUserService,
	useClass: UpdateUserServiceImpl
};

export const updateUserApplication = {
	provide: TYPES.applications.UpdateUserApplication,
	useClass: UpdateUserApplicationImpl
};

export const getUserApplication = {
	provide: TYPES.applications.GetUserApplication,
	useClass: GetUserApplicationImpl
};

export const userRepository = {
	provide: TYPES.repository,
	useClass: UserRepository
};

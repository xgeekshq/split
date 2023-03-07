import { DeleteTeamApplication } from './applications/delete.user.application';
import { GetUserApplication } from './applications/get.user.application';
import { UpdateUserApplicationImpl } from './applications/update.user.application';
import { TYPES } from './interfaces/types';
import { UserRepository } from './repository/user.repository';
import CreateUserService from './services/create.user.service';
import DeleteUserService from './services/delete.user.service';
import GetUserService from './services/get.user.service';
import UpdateUserService from './services/update.user.service';

export const createUserService = {
	provide: TYPES.services.CreateUserService,
	useClass: CreateUserService
};

export const getUserService = {
	provide: TYPES.services.GetUserService,
	useClass: GetUserService
};

export const updateUserService = {
	provide: TYPES.services.UpdateUserService,
	useClass: UpdateUserService
};

export const updateUserApplication = {
	provide: TYPES.applications.UpdateUserApplication,
	useClass: UpdateUserApplicationImpl
};

export const getUserApplication = {
	provide: TYPES.applications.GetUserApplication,
	useClass: GetUserApplication
};

export const userRepository = {
	provide: TYPES.repository,
	useClass: UserRepository
};

export const deleteUserService = {
	provide: TYPES.services.DeleteUserService,
	useClass: DeleteUserService
};

export const deleteUserApplication = {
	provide: TYPES.applications.DeleteUserApplication,
	useClass: DeleteTeamApplication
};

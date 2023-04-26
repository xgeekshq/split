import { DeleteUserUseCase } from './applications/delete-user.use-case';
import { TYPES } from './constants';
import { UserRepository } from './repository/user.repository';
import CreateUserService from './services/create.user.service';
import GetUserService from './services/get.user.service';
import GetAllUsersWithTeamsUseCase from './applications/get-all-users-with-teams.use-case';
import { GetUserUseCase } from './applications/get-user.use-case';
import GetAllUsersUseCase from './applications/get-all-users.use-case';
import UpdateSAdminUseCase from './applications/update-sadmin.use-case';
import UpdateUserService from './services/update.user.service';

export const createUserService = {
	provide: TYPES.services.CreateUserService,
	useClass: CreateUserService
};

export const getUserService = {
	provide: TYPES.services.GetUserService,
	useClass: GetUserService
};

export const getAllUsersUseCase = {
	provide: TYPES.applications.GetAllUsersUseCase,
	useClass: GetAllUsersUseCase
};

export const getUserUseCase = {
	provide: TYPES.applications.GetUserUseCase,
	useClass: GetUserUseCase
};

export const updateUserService = {
	provide: TYPES.services.UpdateUserService,
	useClass: UpdateUserService
};

export const getAllUsersWithTeamsUseCase = {
	provide: TYPES.applications.GetAllUsersWithTeamsUseCase,
	useClass: GetAllUsersWithTeamsUseCase
};

export const updateSAdminUseCase = {
	provide: TYPES.applications.UpdateSAdminUseCase,
	useClass: UpdateSAdminUseCase
};

export const userRepository = {
	provide: TYPES.repository,
	useClass: UserRepository
};

export const deleteUserUseCase = {
	provide: TYPES.applications.DeleteUserUseCase,
	useClass: DeleteUserUseCase
};

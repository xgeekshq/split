import { DeleteTeamApplication } from './use-cases/delete.user.application';
import { GetUserApplication } from './use-cases/get.user.application';
import { UpdateUserApplication } from './use-cases/update.user.application';
import { TYPES } from './interfaces/types';
import { UserRepository } from './repository/user.repository';
import CreateUserService from './services/create.user.service';
import DeleteUserService from './services/delete.user.service';
import GetUserService from './services/get.user.service';
import UpdateUserService from './services/update.user.service';
import GetAllUsersWithTeamsUseCase from './use-cases/get-all-users-with-teams.use-case';
import { GetUserUseCase } from './use-cases/get-user.user-case';
import GetAllUsersUseCase from './use-cases/get-all-users.use-case';
import UpdateSAdminUseCase from './use-cases/update-sadmin.use-case';

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
	useClass: UpdateUserApplication
};

export const getUserApplication = {
	provide: TYPES.applications.GetUserApplication,
	useClass: GetUserApplication
};

export const getAllUsersUseCase = {
	provide: TYPES.useCases.GetAllUsersUseCase,
	useClass: GetAllUsersUseCase
};

export const getUserUseCase = {
	provide: TYPES.useCases.GetUserUseCase,
	useClass: GetUserUseCase
};

export const getAllUsersWithTeamsUseCase = {
	provide: TYPES.useCases.GetAllUsersWithTeamsUseCase,
	useClass: GetAllUsersWithTeamsUseCase
};

export const updateSAdminUseCase = {
	provide: TYPES.useCases.UpdateSAdminUseCase,
	useClass: UpdateSAdminUseCase
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

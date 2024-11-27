import { DeleteUserUseCase } from './applications/delete-user.use-case';
import {
	CREATE_USER_SERVICE,
	DELETE_USER_USE_CASE,
	GET_ALL_USERS_INCLUDE_DELETED_USE_CASE,
	GET_ALL_USERS_USE_CASE,
	GET_ALL_USERS_WITH_TEAM_USE_CASE,
	GET_USER_SERVICE,
	GET_USER_USE_CASE,
	UPDATE_SADMIN_USE_CASE,
	UPDATE_USER_SERVICE,
	USER_REPOSITORY
} from './constants';
import { UserRepository } from './repository/user.repository';
import CreateUserService from './services/create.user.service';
import GetUserService from './services/get.user.service';
import GetAllUsersWithTeamsUseCase from './applications/get-all-users-with-teams.use-case';
import { GetUserUseCase } from './applications/get-user.use-case';
import GetAllUsersUseCase from './applications/get-all-users.use-case';
import UpdateSAdminUseCase from './applications/update-sadmin.use-case';
import UpdateUserService from './services/update.user.service';
import GetAllUsersIncludeDeletedUseCase from './applications/get-all-users-include-deleted.use-case';

/* SERVICES */
export const createUserService = {
	provide: CREATE_USER_SERVICE,
	useClass: CreateUserService
};

export const updateUserService = {
	provide: UPDATE_USER_SERVICE,
	useClass: UpdateUserService
};

export const getUserService = {
	provide: GET_USER_SERVICE,
	useClass: GetUserService
};

/* USE CASES */

export const getAllUsersWithTeamsUseCase = {
	provide: GET_ALL_USERS_WITH_TEAM_USE_CASE,
	useClass: GetAllUsersWithTeamsUseCase
};

export const updateSAdminUseCase = {
	provide: UPDATE_SADMIN_USE_CASE,
	useClass: UpdateSAdminUseCase
};

export const deleteUserUseCase = {
	provide: DELETE_USER_USE_CASE,
	useClass: DeleteUserUseCase
};

export const getAllUsersUseCase = {
	provide: GET_ALL_USERS_USE_CASE,
	useClass: GetAllUsersUseCase
};

export const getUserUseCase = {
	provide: GET_USER_USE_CASE,
	useClass: GetUserUseCase
};

/* REPOSITORY */

export const userRepository = {
	provide: USER_REPOSITORY,
	useClass: UserRepository
};

export const getAllUsersIncludeDeletedUseCase = {
	provide: GET_ALL_USERS_INCLUDE_DELETED_USE_CASE,
	useClass: GetAllUsersIncludeDeletedUseCase
};

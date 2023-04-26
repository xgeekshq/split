export const TYPES = {
	services: {
		CreateUserService: 'CreateUserService',
		GetUserService: 'GetUserService',
		UpdateUserService: 'UpdateUserService',
		DeleteUserService: 'DeleteUserService'
	},
	applications: {
		GetAllUsersUseCase: 'GetAllUsersUseCase',
		GetAllUsersWithTeamsUseCase: 'GetAllUsersWithTeamsUseCase',
		GetUserUseCase: 'GetUserUseCase',
		UpdateSAdminUseCase: 'UpdateSAdminUseCase',
		DeleteUserUseCase: 'DeleteUserUseCase'
	},
	repository: 'UserRepository'
};

/* SERVICES */
export const CREATE_USER_SERVICE = 'CreateUserService';

export const GET_USER_SERVICE = 'GetUserService';

export const UPDATE_USER_SERVICE = 'UpdateUserService';

export const DELETE_USER_SERVICE = 'DeleteUserService';

/* USE CASES */

export const GET_ALL_USERS_USE_CASE = 'GetAllUsersUseCase';

export const GET_ALL_USERS_WITH_TEAM_USE_CASE = 'GetAllUsersWithTeamsUseCase';

export const GET_USER_USE_CASE = 'GetUserUseCase';

export const UPDATE_SADMIN_USE_CASE = 'UpdateSAdminUseCase';

export const DELETE_USER_USE_CASE = 'DeleteUserUseCase';

/* REPOSITORY */

export const USER_REPOSITORY = 'UserRepository';

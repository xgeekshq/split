import { AddAndRemoveTeamUsersUseCase } from './applications/add-and-remove-team-users.use-case';
import { UpdateTeamUserUseCase } from './applications/update-team-user.use-case';
import { CreateTeamUsersUseCase } from './applications/create-team-users.use-case';
import { CreateTeamUserUseCase } from './applications/create-team-user.use-case';
import { TeamUserRepository } from './repositories/team-user.repository';
import {
	ADD_AND_REMOVE_TEAM_USER_USE_CASE,
	CREATE_TEAM_USERS_USE_CASE,
	CREATE_TEAM_USER_SERVICE,
	CREATE_TEAM_USER_USE_CASE,
	DELETE_TEAM_USER_SERVICE,
	DELETE_TEAM_USER_USE_CASE,
	GET_TEAM_USER_SERVICE,
	TEAM_USER_REPOSITORY,
	UPDATE_TEAM_USER_SERVICE,
	UPDATE_TEAM_USER_USE_CASE
} from './constants';
import CreateTeamUserService from './services/create.team.user.service';
import DeleteTeamUserService from './services/delete.team.user.service';
import GetTeamUserService from './services/get.team.user.service';
import UpdateTeamUserService from './services/update.team.user.service';
import { DeleteTeamUserUseCase } from './applications/delete-team-user.use-case';

export const teamUserRepository = {
	provide: TEAM_USER_REPOSITORY,
	useClass: TeamUserRepository
};

export const createTeamUserService = {
	provide: CREATE_TEAM_USER_SERVICE,
	useClass: CreateTeamUserService
};

export const getTeamUserService = {
	provide: GET_TEAM_USER_SERVICE,
	useClass: GetTeamUserService
};

export const updateTeamUserService = {
	provide: UPDATE_TEAM_USER_SERVICE,
	useClass: UpdateTeamUserService
};

export const deleteTeamUserService = {
	provide: DELETE_TEAM_USER_SERVICE,
	useClass: DeleteTeamUserService
};

export const createTeamUserUseCase = {
	provide: CREATE_TEAM_USER_USE_CASE,
	useClass: CreateTeamUserUseCase
};

export const createTeamUsersUseCase = {
	provide: CREATE_TEAM_USERS_USE_CASE,
	useClass: CreateTeamUsersUseCase
};

export const updateTeamUserUseCase = {
	provide: UPDATE_TEAM_USER_USE_CASE,
	useClass: UpdateTeamUserUseCase
};

export const addAndRemoveTeamUsersUseCase = {
	provide: ADD_AND_REMOVE_TEAM_USER_USE_CASE,
	useClass: AddAndRemoveTeamUsersUseCase
};

export const deleteTeamUserUseCase = {
	provide: DELETE_TEAM_USER_USE_CASE,
	useClass: DeleteTeamUserUseCase
};

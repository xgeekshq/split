import { AddAndRemoveTeamUsersUseCase } from './applications/add-and-remove-team-users.use-case';
import { UpdateTeamUserUseCase } from './applications/update-team-user.use-case';
import { CreateTeamUsersUseCase } from './applications/create-team-users.use-case';
import { CreateTeamUserUseCase } from './applications/create-team-user.use-case';
import { TeamUserRepository } from './repositories/team-user.repository';
import { TYPES } from './interfaces/types';
import CreateTeamUserService from './services/create.team.user.service';
import DeleteTeamUserService from './services/delete.team.user.service';
import GetTeamUserService from './services/get.team.user.service';
import UpdateTeamUserService from './services/update.team.user.service';
import { DeleteTeamUserUseCase } from './applications/delete-team-user.use-case';

export const teamUserRepository = {
	provide: TYPES.repositories.TeamUserRepository,
	useClass: TeamUserRepository
};

export const createTeamUserService = {
	provide: TYPES.services.CreateTeamUserService,
	useClass: CreateTeamUserService
};

export const getTeamUserService = {
	provide: TYPES.services.GetTeamUserService,
	useClass: GetTeamUserService
};

export const updateTeamUserService = {
	provide: TYPES.services.UpdateTeamUserService,
	useClass: UpdateTeamUserService
};

export const deleteTeamUserService = {
	provide: TYPES.services.DeleteTeamUserService,
	useClass: DeleteTeamUserService
};

export const createTeamUserUseCase = {
	provide: TYPES.applications.CreateTeamUserUseCase,
	useClass: CreateTeamUserUseCase
};

export const createTeamUsersUseCase = {
	provide: TYPES.applications.CreateTeamUsersUseCase,
	useClass: CreateTeamUsersUseCase
};

export const updateTeamUserUseCase = {
	provide: TYPES.applications.UpdateTeamUserUseCase,
	useClass: UpdateTeamUserUseCase
};

export const addAndRemoveTeamUsersUseCase = {
	provide: TYPES.applications.AddAndRemoveTeamUsersUseCase,
	useClass: AddAndRemoveTeamUsersUseCase
};

export const deleteTeamUserUseCase = {
	provide: TYPES.applications.DeleteTeamUserUseCase,
	useClass: DeleteTeamUserUseCase
};

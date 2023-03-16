import { UpdateTeamUserApplication } from './applications/update.team.user.application';
import { GetTeamUserApplication } from './applications/get.team.user.application';
import { CreateTeamUserApplication } from './applications/create.team.user.application.interface';
import { DeleteTeamUserApplication } from './applications/delete.team.user.application';
import { TeamUserRepository } from './repositories/team-user.repository';
import { TYPES } from './interfaces/types';
import CreateTeamUserService from './services/create.team.user.service';
import DeleteTeamUserService from './services/delete.team.user.service';
import GetTeamUserService from './services/get.team.user.service';
import UpdateTeamUserService from './services/update.team.user.service';

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


export const createTeamUserApplication = {
	provide: TYPES.applications.CreateTeamUserApplication,
	useClass: CreateTeamUserApplication
};

export const getTeamUserApplication = {
	provide: TYPES.applications.GetTeamUserApplication,
	useClass: GetTeamUserApplication
};

export const updateTeamUserApplication = {
	provide: TYPES.applications.UpdateTeamUserApplication,
	useClass: UpdateTeamUserApplication
};

export const deleteTeamUserApplication = {
	provide: TYPES.applications.DeleteTeamUserApplication,
	useClass: DeleteTeamUserApplication
};


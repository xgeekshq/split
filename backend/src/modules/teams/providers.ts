import { CreateTeamApplication } from './applications/create.team.application';
import { DeleteTeamApplication } from './applications/delete.team.application';
import { GetTeamApplication } from './applications/get.team.application';
import { UpdateTeamApplication } from './applications/update.team.application';
import { TYPES } from './interfaces/types';
import { TeamUserRepository } from './repositories/team-user.repository';
import { TeamRepository } from './repositories/team.repository';
import CreateTeamService from './services/create.team.service';
import DeleteTeamService from './services/delete.team.service';
import GetTeamService from './services/get.team.service';
import UpdateTeamService from './services/update.team.service';
import DeleteTeamUserService from './services/delete.team.user.service';
import { DeleteTeamUserApplication } from './applications/delete.team.user.application';

export const createTeamService = {
	provide: TYPES.services.CreateTeamService,
	useClass: CreateTeamService
};

export const createTeamApplication = {
	provide: TYPES.applications.CreateTeamApplication,
	useClass: CreateTeamApplication
};

export const getTeamService = {
	provide: TYPES.services.GetTeamService,
	useClass: GetTeamService
};

export const getTeamApplication = {
	provide: TYPES.applications.GetTeamApplication,
	useClass: GetTeamApplication
};

export const updateTeamService = {
	provide: TYPES.services.UpdateTeamService,
	useClass: UpdateTeamService
};

export const updateTeamApplication = {
	provide: TYPES.applications.UpdateTeamApplication,
	useClass: UpdateTeamApplication
};

export const deleteTeamService = {
	provide: TYPES.services.DeleteTeamService,
	useClass: DeleteTeamService
};

export const deleteTeamApplication = {
	provide: TYPES.applications.DeleteTeamApplication,
	useClass: DeleteTeamApplication
};

export const teamRepository = {
	provide: TYPES.repositories.TeamRepository,
	useClass: TeamRepository
};

export const teamUserRepository = {
	provide: TYPES.repositories.TeamUserRepository,
	useClass: TeamUserRepository
};

export const deleteTeamUserService = {
	provide: TYPES.services.DeleteTeamUserService,
	useClass: DeleteTeamUserService
};

export const deleteTeamUserApplication = {
	provide: TYPES.applications.DeleteTeamUserApplication,
	useClass: DeleteTeamUserApplication
};

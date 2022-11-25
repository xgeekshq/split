import { CreateTeamApplication } from './applications/create.team.application';
import { GetTeamApplication } from './applications/get.team.application';
import { UpdateTeamApplication } from './applications/update.team.application';
import { TYPES } from './interfaces/types';
import CreateTeamService from './services/create.team.service';
import GetTeamService from './services/get.team.service';
import UpdateTeamService from './services/update.team.service';

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

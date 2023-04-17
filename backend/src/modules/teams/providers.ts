import { CreateTeamApplication } from './applications/create.team.application';
import { DeleteTeamApplication } from './applications/delete.team.application';
import { GetTeamApplication } from './applications/get.team.application';
import {
	CREATE_TEAM_APPLICATION,
	CREATE_TEAM_SERVICE,
	DELETE_TEAM_APPLICATION,
	DELETE_TEAM_SERVICE,
	GET_TEAM_APPLICATION,
	GET_TEAM_SERVICE,
	TEAM_REPOSITORY
} from './constants';
import { TeamRepository } from './repositories/team.repository';
import CreateTeamService from './services/create.team.service';
import DeleteTeamService from './services/delete.team.service';
import GetTeamService from './services/get.team.service';

export const createTeamService = {
	provide: CREATE_TEAM_SERVICE,
	useClass: CreateTeamService
};

export const createTeamApplication = {
	provide: CREATE_TEAM_APPLICATION,
	useClass: CreateTeamApplication
};

export const getTeamService = {
	provide: GET_TEAM_SERVICE,
	useClass: GetTeamService
};

export const getTeamApplication = {
	provide: GET_TEAM_APPLICATION,
	useClass: GetTeamApplication
};

export const deleteTeamService = {
	provide: DELETE_TEAM_SERVICE,
	useClass: DeleteTeamService
};

export const deleteTeamApplication = {
	provide: DELETE_TEAM_APPLICATION,
	useClass: DeleteTeamApplication
};

export const teamRepository = {
	provide: TEAM_REPOSITORY,
	useClass: TeamRepository
};

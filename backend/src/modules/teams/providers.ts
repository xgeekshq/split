import { CreateTeamApplicationImpl } from './applications/create.team.application';
import { GetTeamApplicationImpl } from './applications/get.team.application';
import { TYPES } from './interfaces/types';
import CreateTeamServiceImpl from './services/create.team.service';
import GetTeamServiceImpl from './services/get.team.service';

export const createTeamService = {
  provide: TYPES.services.CreateTeamService,
  useClass: CreateTeamServiceImpl,
};

export const createTeamApplication = {
  provide: TYPES.applications.CreateTeamApplication,
  useClass: CreateTeamApplicationImpl,
};

export const getTeamService = {
  provide: TYPES.services.GetTeamService,
  useClass: GetTeamServiceImpl,
};

export const getTeamApplication = {
  provide: TYPES.applications.GetTeamApplication,
  useClass: GetTeamApplicationImpl,
};

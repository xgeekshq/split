import { CreateTeamApplication } from './applications/create.team.application';
import { GetTeamApplication } from './applications/get.team.application';
import { TYPES } from './interfaces/types';
import CreateTeamService from './services/create.team.service';
import GetTeamService from './services/get.team.service';

export const createTeamService = {
  provide: TYPES.services.CreateTeamService,
  useClass: CreateTeamService,
};

export const createTeamApplication = {
  provide: TYPES.applications.CreateTeamApplication,
  useClass: CreateTeamApplication,
};

export const getTeamService = {
  provide: TYPES.services.GetTeamService,
  useClass: GetTeamService,
};

export const getTeamApplication = {
  provide: TYPES.applications.GetTeamApplication,
  useClass: GetTeamApplication,
};

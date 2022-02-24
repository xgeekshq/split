import { CreateVoteApplicationImpl } from './applications/create.vote.application';
import { DeleteVoteApplicationImpl } from './applications/delete.vote.application';
import { TYPES } from './interfaces/types';
import CreateVoteServiceImpl from './services/create.vote.service';
import DeleteVoteServiceImpl from './services/delete.vote.service';

export const createVoteService = {
  provide: TYPES.services.CreateVoteService,
  useClass: CreateVoteServiceImpl,
};

export const deleteVoteService = {
  provide: TYPES.services.DeleteVoteService,
  useClass: DeleteVoteServiceImpl,
};

export const createVoteApplication = {
  provide: TYPES.applications.CreateVoteApplication,
  useClass: CreateVoteApplicationImpl,
};

export const deleteVoteApplication = {
  provide: TYPES.applications.DeleteVoteApplication,
  useClass: DeleteVoteApplicationImpl,
};

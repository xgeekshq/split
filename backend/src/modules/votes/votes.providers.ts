import { VoteRepository } from './repositories/vote.repository';
import { CreateVoteApplication } from './applications/create.vote.application';
import { DeleteVoteApplication } from './applications/delete.vote.application';
import { TYPES } from './interfaces/types';
import CreateVoteService from './services/create.vote.service';
import DeleteVoteService from './services/delete.vote.service';
import { CreateVoteUseCase } from './applications/create-vote.use-case';

export const createVoteService = {
	provide: TYPES.services.CreateVoteService,
	useClass: CreateVoteService
};

export const deleteVoteService = {
	provide: TYPES.services.DeleteVoteService,
	useClass: DeleteVoteService
};

export const createVoteUseCase = {
	provide: TYPES.applications.CreateVoteUseCase,
	useClass: CreateVoteUseCase
};

export const createVoteApplication = {
	provide: TYPES.applications.CreateVoteApplication,
	useClass: CreateVoteApplication
};

export const deleteVoteApplication = {
	provide: TYPES.applications.DeleteVoteApplication,
	useClass: DeleteVoteApplication
};

export const voteRepository = {
	provide: TYPES.repositories.VoteRepository,
	useClass: VoteRepository
};

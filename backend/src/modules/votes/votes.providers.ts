import { VoteRepository } from './repositories/vote.repository';
import { DeleteVoteApplication } from './applications/delete.vote.application';
import { TYPES } from './interfaces/types';
import CreateVoteService from './services/create.vote.service';
import DeleteVoteService from './services/delete.vote.service';
import { CreateCardItemVoteUseCase } from './applications/create/create-card-item-vote.use-case';
import { CreateCardGroupVoteUseCase } from './applications/create/create-card-group-vote.use-case';

export const createVoteService = {
	provide: TYPES.services.CreateVoteService,
	useClass: CreateVoteService
};

export const deleteVoteService = {
	provide: TYPES.services.DeleteVoteService,
	useClass: DeleteVoteService
};

export const createCardItemVoteUseCase = {
	provide: TYPES.applications.CreateCardItemVoteUseCase,
	useClass: CreateCardItemVoteUseCase
};

export const createCardGroupVoteUseCase = {
	provide: TYPES.applications.CreateCardGroupVoteUseCase,
	useClass: CreateCardGroupVoteUseCase
};

export const deleteVoteApplication = {
	provide: TYPES.applications.DeleteVoteApplication,
	useClass: DeleteVoteApplication
};

export const voteRepository = {
	provide: TYPES.repositories.VoteRepository,
	useClass: VoteRepository
};

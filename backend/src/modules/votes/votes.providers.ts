import { VoteRepository } from './repositories/vote.repository';
import { DeleteVoteApplication } from './applications/delete.vote.application';
import { TYPES } from './interfaces/types';
import CreateVoteService from './services/create.vote.service';
import DeleteVoteService from './services/delete.vote.service';
import { CardItemVoteUseCase } from './applications/card-item-vote.use-case';
import { CardGroupVoteUseCase } from './applications/card-group-vote.use-case';

export const createVoteService = {
	provide: TYPES.services.CreateVoteService,
	useClass: CreateVoteService
};

export const deleteVoteService = {
	provide: TYPES.services.DeleteVoteService,
	useClass: DeleteVoteService
};

export const cardItemVoteUseCase = {
	provide: TYPES.applications.CardItemVoteUseCase,
	useClass: CardItemVoteUseCase
};

export const cardGroupVoteUseCase = {
	provide: TYPES.applications.CardGroupVoteUseCase,
	useClass: CardGroupVoteUseCase
};

export const deleteVoteApplication = {
	provide: TYPES.applications.DeleteVoteApplication,
	useClass: DeleteVoteApplication
};

export const voteRepository = {
	provide: TYPES.repositories.VoteRepository,
	useClass: VoteRepository
};

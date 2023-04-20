import { VoteRepository } from './repositories/vote.repository';
import { CREATE_VOTE_SERVICE, TYPES } from './constants';
import CreateVoteService from './services/create.vote.service';
import DeleteVoteService from './services/delete.vote.service';
import { CardItemVoteUseCase } from './applications/card-item-vote.use-case';
import { CardGroupVoteUseCase } from './applications/card-group-vote.use-case';

/* SERVICES */

export const createVoteService = {
	provide: CREATE_VOTE_SERVICE,
	useClass: CreateVoteService
};

export const deleteVoteService = {
	provide: TYPES.services.DeleteVoteService,
	useClass: DeleteVoteService
};

/* USE CASES */

export const cardItemVoteUseCase = {
	provide: TYPES.applications.CardItemVoteUseCase,
	useClass: CardItemVoteUseCase
};

export const cardGroupVoteUseCase = {
	provide: TYPES.applications.CardGroupVoteUseCase,
	useClass: CardGroupVoteUseCase
};

/* REPOSITORY */

export const voteRepository = {
	provide: TYPES.repositories.VoteRepository,
	useClass: VoteRepository
};

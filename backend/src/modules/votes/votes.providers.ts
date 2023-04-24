import { VoteRepository } from './repositories/vote.repository';
import {
	CARD_GROUP_VOTE_USE_CASE,
	CARD_ITEM_VOTE_USE_CASE,
	CREATE_VOTE_SERVICE,
	DELETE_VOTE_SERVICE,
	VOTE_REPOSITORY
} from './constants';
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
	provide: DELETE_VOTE_SERVICE,
	useClass: DeleteVoteService
};

/* USE CASES */

export const cardItemVoteUseCase = {
	provide: CARD_ITEM_VOTE_USE_CASE,
	useClass: CardItemVoteUseCase
};

export const cardGroupVoteUseCase = {
	provide: CARD_GROUP_VOTE_USE_CASE,
	useClass: CardGroupVoteUseCase
};

/* REPOSITORY */

export const voteRepository = {
	provide: VOTE_REPOSITORY,
	useClass: VoteRepository
};

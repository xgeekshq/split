import { VotesBoardUserRepository } from './repositories/votes-board-user.repository';
import { VotesBoardRepository } from './repositories/votes-board.repository';
import { CreateVoteApplicationImpl } from './applications/create.vote.application';
import { DeleteVoteApplicationImpl } from './applications/delete.vote.application';
import { TYPES } from './interfaces/types';
import CreateVoteService from './services/create.vote.service';
import DeleteVoteService from './services/delete.vote.service';

export const createVoteService = {
	provide: TYPES.services.CreateVoteService,
	useClass: CreateVoteService
};

export const deleteVoteService = {
	provide: TYPES.services.DeleteVoteService,
	useClass: DeleteVoteService
};

export const createVoteApplication = {
	provide: TYPES.applications.CreateVoteApplication,
	useClass: CreateVoteApplicationImpl
};

export const deleteVoteApplication = {
	provide: TYPES.applications.DeleteVoteApplication,
	useClass: DeleteVoteApplicationImpl
};

export const votesBoardRepository = {
	provide: TYPES.repositories.VotesBoardRepository,
	useClass: VotesBoardRepository
};

export const votesBoardUserRepository = {
	provide: TYPES.repositories.VotesBoardUserRepository,
	useClass: VotesBoardUserRepository
};

import { CreateCardUseCase } from './applications/create-card.use-case';
import { CreateCardApplication } from './applications/create.card.application';
import { DeleteCardApplication } from './applications/delete.card.application';
import { MergeCardApplication } from './applications/merge.card.application';
import { UnmergeCardApplication } from './applications/unmerge.card.application';
import { UpdateCardApplication } from './applications/update.card.application';
import { TYPES } from './interfaces/types';
import { CardRepository } from './repository/card.repository';
import CreateCardService from './services/create.card.service';
import DeleteCardService from './services/delete.card.service';
import GetCardService from './services/get.card.service';
import { MergeCardService } from './services/merge.card.service';
import { UnmergeCardService } from './services/unmerge.card.service';
import UpdateCardService from './services/update.card.service';

export const createCardService = {
	provide: TYPES.services.CreateCardService,
	useClass: CreateCardService
};

export const getCardService = {
	provide: TYPES.services.GetCardService,
	useClass: GetCardService
};

export const updateCardService = {
	provide: TYPES.services.UpdateCardService,
	useClass: UpdateCardService
};

export const deleteCardService = {
	provide: TYPES.services.DeleteCardService,
	useClass: DeleteCardService
};

export const mergeCardService = {
	provide: TYPES.services.MergeCardService,
	useClass: MergeCardService
};

export const unmergeCardService = {
	provide: TYPES.services.UnmergeCardService,
	useClass: UnmergeCardService
};

export const createCardApplication = {
	provide: TYPES.applications.CreateCardApplication,
	useClass: CreateCardApplication
};

export const updateCardApplication = {
	provide: TYPES.applications.UpdateCardApplication,
	useClass: UpdateCardApplication
};

export const deleteCardApplication = {
	provide: TYPES.applications.DeleteCardApplication,
	useClass: DeleteCardApplication
};

export const mergeCardApplication = {
	provide: TYPES.applications.MergeCardApplication,
	useClass: MergeCardApplication
};

export const unmergeCardApplication = {
	provide: TYPES.applications.UnmergeCardApplication,
	useClass: UnmergeCardApplication
};

export const cardRepository = {
	provide: TYPES.repository.CardRepository,
	useClass: CardRepository
};

export const creacteCardUseCase = {
	provide: TYPES.applications.CreateCardUseCase,
	useClass: CreateCardUseCase
};

import { CreateCardUseCase } from './applications/create-card.use-case';
import { DeleteCardUseCase } from './applications/delete-card.use-case';
import { DeleteFromCardGroupUseCase } from './applications/delete-from-card-group.use-case';
import { UnmergeCardUseCase } from './applications/unmerge-card.use-case';
import { MergeCardUseCase } from './applications/merge-card.use-case';
import { UpdateCardApplication } from './applications/update.card.application';
import { TYPES } from './interfaces/types';
import { CardRepository } from './repository/card.repository';
import GetCardService from './services/get.card.service';
import UpdateCardService from './services/update.card.service';

export const getCardService = {
	provide: TYPES.services.GetCardService,
	useClass: GetCardService
};

export const updateCardService = {
	provide: TYPES.services.UpdateCardService,
	useClass: UpdateCardService
};

export const updateCardApplication = {
	provide: TYPES.applications.UpdateCardApplication,
	useClass: UpdateCardApplication
};

export const cardRepository = {
	provide: TYPES.repository.CardRepository,
	useClass: CardRepository
};

export const createCardUseCase = {
	provide: TYPES.applications.CreateCardUseCase,
	useClass: CreateCardUseCase
};

export const mergeCardUseCase = {
	provide: TYPES.applications.MergeCardUseCase,
	useClass: MergeCardUseCase
};

export const deleteCardUseCase = {
	provide: TYPES.applications.DeleteCardUseCase,
	useClass: DeleteCardUseCase
};

export const deleteFromCardGroupUseCase = {
	provide: TYPES.applications.DeleteFromCardGroupUseCase,
	useClass: DeleteFromCardGroupUseCase
};

export const unmergeCardUseCase = {
	provide: TYPES.applications.UnmergeCardUseCase,
	useClass: UnmergeCardUseCase
};

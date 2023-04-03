import { CreateCardUseCase } from './applications/create-card.use-case';
import { DeleteCardApplication } from './applications/delete.card.application';
import { UnmergeCardUseCase } from './applications/unmerge-card.use-case';
import { MergeCardUseCase } from './applications/merge-card.use-case';
import { UpdateCardApplication } from './applications/update.card.application';
import { TYPES } from './interfaces/types';
import { CardRepository } from './repository/card.repository';
import DeleteCardService from './services/delete.card.service';
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

export const deleteCardService = {
	provide: TYPES.services.DeleteCardService,
	useClass: DeleteCardService
};

export const updateCardApplication = {
	provide: TYPES.applications.UpdateCardApplication,
	useClass: UpdateCardApplication
};

export const deleteCardApplication = {
	provide: TYPES.applications.DeleteCardApplication,
	useClass: DeleteCardApplication
};

export const cardRepository = {
	provide: TYPES.repository.CardRepository,
	useClass: CardRepository
};

export const creacteCardUseCase = {
	provide: TYPES.applications.CreateCardUseCase,
	useClass: CreateCardUseCase
};

export const mergeCardUseCase = {
	provide: TYPES.applications.MergeCardUseCase,
	useClass: MergeCardUseCase
};

export const unmergeCardUseCase = {
	provide: TYPES.applications.UnmergeCardUseCase,
	useClass: UnmergeCardUseCase
};

import { CreateCardUseCase } from './applications/create-card.use-case';
import { DeleteCardUseCase } from './applications/delete-card.use-case';
import { DeleteFromCardGroupUseCase } from './applications/delete-from-card-group.use-case';
import { UnmergeCardUseCase } from './applications/unmerge-card.use-case';
import { MergeCardUseCase } from './applications/merge-card.use-case';
import { TYPES } from './interfaces/types';
import { CardRepository } from './repository/card.repository';
import GetCardService from './services/get.card.service';
import { UpdateCardPositionUseCase } from './applications/update/update-card-position.use-case';
import { UpdateCardTextUseCase } from './applications/update/update-card-text.use-case';
import { UpdateCardGroupTextUseCase } from './applications/update/update-card-group-text.use-case';

export const getCardService = {
	provide: TYPES.services.GetCardService,
	useClass: GetCardService
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

export const updateCardPositionUseCase = {
	provide: TYPES.applications.UpdateCardPositionUseCase,
	useClass: UpdateCardPositionUseCase
};

export const updateCardTextUseCase = {
	provide: TYPES.applications.UpdateCardTextUseCase,
	useClass: UpdateCardTextUseCase
};

export const updateCardGroupTextUseCase = {
	provide: TYPES.applications.UpdateCardGroupTextUseCase,
	useClass: UpdateCardGroupTextUseCase
};

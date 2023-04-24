import { CreateCardUseCase } from './applications/create-card.use-case';
import { DeleteCardUseCase } from './applications/delete-card.use-case';
import { DeleteFromCardGroupUseCase } from './applications/delete-from-card-group.use-case';
import { UnmergeCardUseCase } from './applications/unmerge-card.use-case';
import { MergeCardUseCase } from './applications/merge-card.use-case';
import {
	CARD_REPOSITORY,
	CREATE_CARD_USE_CASE,
	DELETE_CARD_FROM_GROUP_USE_CASE,
	DELETE_CARD_USE_CASE,
	GET_CARD_SERVICE,
	MERGE_CARD_USE_CASE,
	UNMERGE_CARD_USE_CASE,
	UPDATE_CARD_GROUP_TEXT_USE_CASE,
	UPDATE_CARD_POSITION_USE_CASE,
	UPDATE_CARD_TEXT_USE_CASE
} from './constants';
import { CardRepository } from './repository/card.repository';
import GetCardService from './services/get.card.service';
import { UpdateCardPositionUseCase } from './applications/update/update-card-position.use-case';
import { UpdateCardTextUseCase } from './applications/update/update-card-text.use-case';
import { UpdateCardGroupTextUseCase } from './applications/update/update-card-group-text.use-case';

/* SERVICE */

export const getCardService = {
	provide: GET_CARD_SERVICE,
	useClass: GetCardService
};

/* REPOSITORY */

export const cardRepository = {
	provide: CARD_REPOSITORY,
	useClass: CardRepository
};

/* USE CASES */

export const createCardUseCase = {
	provide: CREATE_CARD_USE_CASE,
	useClass: CreateCardUseCase
};

export const mergeCardUseCase = {
	provide: MERGE_CARD_USE_CASE,
	useClass: MergeCardUseCase
};

export const deleteCardUseCase = {
	provide: DELETE_CARD_USE_CASE,
	useClass: DeleteCardUseCase
};

export const deleteCardFromGroupUseCase = {
	provide: DELETE_CARD_FROM_GROUP_USE_CASE,
	useClass: DeleteFromCardGroupUseCase
};

export const unmergeCardUseCase = {
	provide: UNMERGE_CARD_USE_CASE,
	useClass: UnmergeCardUseCase
};

export const updateCardPositionUseCase = {
	provide: UPDATE_CARD_POSITION_USE_CASE,
	useClass: UpdateCardPositionUseCase
};

export const updateCardTextUseCase = {
	provide: UPDATE_CARD_TEXT_USE_CASE,
	useClass: UpdateCardTextUseCase
};

export const updateCardGroupTextUseCase = {
	provide: UPDATE_CARD_GROUP_TEXT_USE_CASE,
	useClass: UpdateCardGroupTextUseCase
};

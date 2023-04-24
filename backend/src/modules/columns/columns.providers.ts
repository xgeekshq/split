import {
	COLUMN_REPOSITORY,
	DELETE_CARDS_FROM_COLUMN_USE_CASE,
	UPDATE_COLUMN_SERVICE,
	UPDATE_COLUMN_USE_CASE
} from 'src/modules/columns/constants';
import { ColumnRepository } from './repositories/column.repository';
import UpdateColumnService from './services/update.column.service';
import { UpdateColumnUseCase } from 'src/modules/columns/applications/update-column.use-case';
import { DeleteCardsFromColumnUseCase } from 'src/modules/columns/applications/delete-cards-from-column.use-case';

/* SERVICE */
export const updateColumnService = {
	provide: UPDATE_COLUMN_SERVICE,
	useClass: UpdateColumnService
};

/* USE CASE */
export const updateColumnUseCase = {
	provide: UPDATE_COLUMN_USE_CASE,
	useClass: UpdateColumnUseCase
};

export const deleteCardsFromColumnUseCase = {
	provide: DELETE_CARDS_FROM_COLUMN_USE_CASE,
	useClass: DeleteCardsFromColumnUseCase
};

/* REPOSITORY */
export const columnRepository = {
	provide: COLUMN_REPOSITORY,
	useClass: ColumnRepository
};

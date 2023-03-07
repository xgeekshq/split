import { UpdateColumnApplicationImpl } from './applications/update.columns.application';
import { TYPES } from './interfaces/types';
import { ColumnRepository } from './repositories/column.repository';
import UpdateColumnServiceImpl from './services/update.column.service';

export const updateColumnService = {
	provide: TYPES.services.UpdateColumnService,
	useClass: UpdateColumnServiceImpl
};

export const updateColumnApplication = {
	provide: TYPES.applications.UpdateColumnApplication,
	useClass: UpdateColumnApplicationImpl
};

export const columnRepository = {
	provide: TYPES.repositories.ColumnRepository,
	useClass: ColumnRepository
};

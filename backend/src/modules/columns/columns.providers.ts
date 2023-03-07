import { UpdateColumnApplication } from './applications/update.columns.application';
import { TYPES } from './interfaces/types';
import { ColumnRepository } from './repositories/column.repository';
import UpdateColumnService from './services/update.column.service';

export const updateColumnService = {
	provide: TYPES.services.UpdateColumnService,
	useClass: UpdateColumnService
};

export const updateColumnApplication = {
	provide: TYPES.applications.UpdateColumnApplication,
	useClass: UpdateColumnApplication
};

export const columnRepository = {
	provide: TYPES.repositories.ColumnRepository,
	useClass: ColumnRepository
};

import { UpdateColumnApplicationImpl } from './applications/update.columns.application';
import { TYPES } from './interfaces/types';
import UpdateColumnServiceImpl from './services/update.column.service';

export const updateColumnService = {
	provide: TYPES.services.UpdateColumnService,
	useClass: UpdateColumnServiceImpl
};

export const updateColumnApplication = {
	provide: TYPES.applications.UpdateColumnApplication,
	useClass: UpdateColumnApplicationImpl
};

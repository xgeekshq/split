import {
	COLUMN_REPOSITORY,
	UPDATE_COLUMN_APPLICATION,
	UPDATE_COLUMN_SERVICE
} from 'src/modules/columns/constants';
import { UpdateColumnApplication } from './applications/update.columns.application';
import { ColumnRepository } from './repositories/column.repository';
import UpdateColumnService from './services/update.column.service';

export const updateColumnService = {
	provide: UPDATE_COLUMN_SERVICE,
	useClass: UpdateColumnService
};

export const updateColumnApplication = {
	provide: UPDATE_COLUMN_APPLICATION,
	useClass: UpdateColumnApplication
};

export const columnRepository = {
	provide: COLUMN_REPOSITORY,
	useClass: ColumnRepository
};

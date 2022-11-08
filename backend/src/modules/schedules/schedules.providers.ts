import { TYPES } from './interfaces/types';
import { CreateSchedulesService } from './services/create.schedules.service';
import { DeleteSchedulesService } from './services/delete.schedules.service';

export const createSchedulesService = {
	provide: TYPES.services.CreateSchedulesService,
	useClass: CreateSchedulesService
};

export const deleteSchedulesService = {
	provide: TYPES.services.DeleteSchedulesService,
	useClass: DeleteSchedulesService
};

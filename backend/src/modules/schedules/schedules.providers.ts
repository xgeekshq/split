import {
	CREATE_SCHEDULES_SERVICE,
	DELETE_SCHEDULES_SERVICE,
	SCHEDULE_REPOSITORY
} from './constants';
import { ScheduleRepository } from './repository/schedule.repository';
import { CreateSchedulesService } from './services/create.schedules.service';
import { DeleteSchedulesService } from './services/delete.schedules.service';

export const createSchedulesService = {
	provide: CREATE_SCHEDULES_SERVICE,
	useClass: CreateSchedulesService
};

export const deleteSchedulesService = {
	provide: DELETE_SCHEDULES_SERVICE,
	useClass: DeleteSchedulesService
};

export const scheduleRepository = {
	provide: SCHEDULE_REPOSITORY,
	useClass: ScheduleRepository
};

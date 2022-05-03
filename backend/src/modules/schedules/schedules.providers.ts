import { TYPES } from './interfaces/types';
import { CreateSchedulesService } from './services/create.schedules.service';

export const createSchedulesService = {
  provide: TYPES.services.CreateSchedulesService,
  useClass: CreateSchedulesService,
};

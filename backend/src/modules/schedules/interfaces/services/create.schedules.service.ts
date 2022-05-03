import { AddCronJobDto } from '../../dto/add.cronjob.dto';

export interface CreateSchedulesServiceInterface {
  addCronJob(
    day: string,
    month: string,
    addCronJobDto: AddCronJobDto,
  ): Promise<void>;
}

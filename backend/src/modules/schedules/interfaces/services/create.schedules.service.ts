import { AddCronJobDto } from '../../dto/add.cronjob.dto';

export interface CreateSchedulesServiceInterface {
	addCronJob(day: number, month: number, addCronJobDto: AddCronJobDto): Promise<void>;
}

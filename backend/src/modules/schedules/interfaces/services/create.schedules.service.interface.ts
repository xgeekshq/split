import { AddCronJobDto } from '../../dto/add.cronjob.dto';

export type AddCronJobType = {
	day: number;
	month: number;
	addCronJobDto: AddCronJobDto;
	hours?: number;
	minutes?: number;
};

export interface CreateSchedulesServiceInterface {
	addCronJob(input: AddCronJobType): Promise<void>;
}

import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { DeleteSchedulesServiceInterface } from '../interfaces/services/delete.schedules.service.interface';
import Schedules, { SchedulesDocument } from '../schemas/schedules.schema';

export class DeleteSchedulesService implements DeleteSchedulesServiceInterface {
	constructor(
		@InjectModel(Schedules.name)
		private schedulesModel: Model<SchedulesDocument>,
		private schedulerRegistry: SchedulerRegistry
	) {}

	private logger = new Logger(DeleteSchedulesService.name);

	async findAndDeleteScheduleByBoardId(boardId: string): Promise<SchedulesDocument | null> {
		try {
			const deletedSchedule = await this.schedulesModel.findOneAndDelete({ board: boardId });
			this.schedulerRegistry.deleteCronJob(boardId);

			return deletedSchedule;
		} catch (e) {
			this.logger.log('Delete cron job failed');
		}

		return null;
	}

	async deleteScheduleByBoardId(boardId: string): Promise<void> {
		await this.schedulesModel.deleteOne({ board: boardId });
	}
}

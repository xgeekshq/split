import { Inject, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { DeleteSchedulesServiceInterface } from '../interfaces/services/delete.schedules.service.interface';
import Schedules from '../entities/schedules.schema';
import { SCHEDULE_REPOSITORY } from '../constants';
import { ScheduleRepositoryInterface } from '../repository/schedule.repository.interface';

export class DeleteSchedulesService implements DeleteSchedulesServiceInterface {
	constructor(
		private readonly schedulerRegistry: SchedulerRegistry,
		@Inject(SCHEDULE_REPOSITORY)
		private readonly scheduleRepository: ScheduleRepositoryInterface
	) {}

	private logger = new Logger(DeleteSchedulesService.name);

	async findAndDeleteScheduleByBoardId(boardId: string): Promise<Schedules | null> {
		try {
			const deletedSchedule = await this.scheduleRepository.deleteScheduleByBoardId(boardId);
			this.schedulerRegistry.deleteCronJob(boardId);

			return deletedSchedule;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			this.logger.log('Delete cron job failed');
		}

		return null;
	}

	async deleteScheduleByBoardId(boardId: string): Promise<void> {
		await this.scheduleRepository.deleteOneSchedule(boardId);
	}

	deleteSchedulesByBoardList(teamBoardsIds: string[], withSession?: boolean) {
		return this.scheduleRepository.deleteSchedulesByBoardList(teamBoardsIds, withSession);
	}

	startTransaction() {
		return this.scheduleRepository.startTransaction();
	}

	commitTransaction() {
		return this.scheduleRepository.commitTransaction();
	}

	abortTransaction() {
		return this.scheduleRepository.abortTransaction();
	}

	endSession() {
		return this.scheduleRepository.endSession();
	}
}

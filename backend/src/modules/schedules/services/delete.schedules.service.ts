import { Inject, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { DeleteSchedulesServiceInterface } from '../interfaces/services/delete.schedules.service.interface';
import Schedules from '../entities/schedules.schema';
import { TYPES } from '../interfaces/types';
import { ScheduleRepositoryInterface } from '../repository/schedule.repository.interface';

export class DeleteSchedulesService implements DeleteSchedulesServiceInterface {
	constructor(
		private schedulerRegistry: SchedulerRegistry,
		@Inject(TYPES.repository.ScheduleRepository)
		private readonly scheduleRepository: ScheduleRepositoryInterface
	) {}

	private logger = new Logger(DeleteSchedulesService.name);

	async findAndDeleteScheduleByBoardId(boardId: string): Promise<Schedules | null> {
		try {
			const deletedSchedule = await this.scheduleRepository.deleteScheduleByBoardId(boardId);
			this.schedulerRegistry.deleteCronJob(boardId);

			return deletedSchedule;
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

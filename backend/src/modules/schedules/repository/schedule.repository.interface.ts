import { DeleteResult } from 'mongodb';
import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import Schedules from '../entities/schedules.schema';

export interface ScheduleRepositoryInterface extends BaseInterfaceRepository<Schedules> {
	getSchedules(): Promise<Schedules[]>;
	deleteScheduleByBoardId(boardId: string): Promise<Schedules>;
	deleteOneSchedule(boardId: string): Promise<DeleteResult>;
	deleteSchedulesByBoardList(teamBoardsIds: string[], withSession?: boolean): Promise<DeleteResult>;
}

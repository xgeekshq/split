import Schedules from '../../entities/schedules.schema';

export interface DeleteSchedulesServiceInterface {
	findAndDeleteScheduleByBoardId(boardId: string): Promise<Schedules | null>;
	deleteScheduleByBoardId(boardId: string): Promise<void>;
}

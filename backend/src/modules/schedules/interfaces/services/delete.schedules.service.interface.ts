import { SchedulesDocument } from 'src/modules/schedules/entities/schedules.schema';

export interface DeleteSchedulesServiceInterface {
	findAndDeleteScheduleByBoardId(boardId: string): Promise<SchedulesDocument | null>;
	deleteScheduleByBoardId(boardId: string): Promise<void>;
}

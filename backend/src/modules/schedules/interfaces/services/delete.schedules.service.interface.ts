import { SchedulesDocument } from "modules/schedules/schemas/schedules.schema";

export interface DeleteSchedulesServiceInterface {
    findAndDeleteScheduleByBoardId(boardId: string): Promise<SchedulesDocument | null>;
	deleteScheduleByBoardId(boardId: string): Promise<void>;
}

import { SessionInterface } from 'src/libs/transactions/session.interface';
import { DeleteResult } from 'mongodb';
import Schedules from '../../entities/schedules.schema';

export interface DeleteSchedulesServiceInterface extends SessionInterface {
	findAndDeleteScheduleByBoardId(boardId: string): Promise<Schedules | null>;
	deleteScheduleByBoardId(boardId: string): Promise<void>;
	deleteSchedulesByBoardList(teamBoardsIds: string[], withSession?: boolean): Promise<DeleteResult>;
}

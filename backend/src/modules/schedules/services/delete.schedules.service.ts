import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { SchedulerRegistry } from "@nestjs/schedule";
import { DeleteSchedulesServiceInterface } from "../interfaces/services/delete.schedules.service";
import Schedules, { SchedulesDocument } from "../schemas/schedules.schema";

export class DeleteSchedulesService implements DeleteSchedulesServiceInterface {
    constructor(
        @InjectModel(Schedules.name)
        private schedulesModel: Model<SchedulesDocument>,
        private schedulerRegistry: SchedulerRegistry
    ) { }

    async findAndDeleteScheduleByBoardId(boardId: string): Promise<SchedulesDocument | null> {
        try {
            const deletedSchedule = await this.schedulesModel.findOneAndDelete({ board: boardId });
            this.schedulerRegistry.deleteCronJob(boardId);
            return deletedSchedule
        } catch (e) {
            console.log(e)
        }
        return null
    }

    async deleteScheduleByBoardId(boardId: string): Promise<void> {
        await this.schedulesModel.deleteOne({ board: boardId })
    }
}
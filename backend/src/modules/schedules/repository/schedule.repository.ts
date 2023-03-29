import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Schedules, { SchedulesDocument } from '../entities/schedules.schema';
import { ScheduleRepositoryInterface } from './schedule.repository.interface';

@Injectable()
export class ScheduleRepository
	extends MongoGenericRepository<Schedules>
	implements ScheduleRepositoryInterface
{
	constructor(@InjectModel(Schedules.name) private model: Model<SchedulesDocument>) {
		super(model);
	}
	getSchedules(): Promise<Schedules[]> {
		return this.findAll();
	}

	deleteScheduleByBoardId(boardId: string): Promise<Schedules> {
		return this.findOneByeFieldAndDelete({ board: boardId });
	}

	deleteOneSchedule(boardId: string): Promise<DeleteResult> {
		return this.deleteOneWithQuery({ board: boardId });
	}

	deleteSchedulesByBoardList(
		teamBoardsIds: string[],
		withSession?: boolean
	): Promise<DeleteResult> {
		return this.deleteManyWithAcknowledged(
			{
				board: { $in: teamBoardsIds }
			},
			withSession
		);
	}
}

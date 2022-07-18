import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Model } from 'mongoose';

import { DELETE_FAILED } from 'libs/exceptions/messages';
import { getDay, getNextMonth } from 'libs/utils/dates';
import {
	Configs,
	CreateBoardService
} from 'modules/boards/interfaces/services/create.board.service.interface';
import * as BoardTypes from 'modules/boards/interfaces/types';

import { AddCronJobDto } from '../dto/add.cronjob.dto';
import { CreateSchedulesServiceInterface } from '../interfaces/services/create.schedules.service';
import Schedules, { SchedulesDocument } from '../schemas/schedules.schema';

@Injectable()
export class CreateSchedulesService implements CreateSchedulesServiceInterface {
	constructor(
		@InjectModel(Schedules.name)
		private schedulesModel: Model<SchedulesDocument>,
		@Inject(forwardRef(() => BoardTypes.TYPES.services.CreateBoardService))
		private createBoardService: CreateBoardService,
		private schedulerRegistry: SchedulerRegistry
	) {}

	async addCronJob(day: number, month: number, addCronJobDto: AddCronJobDto) {
		const { ownerId, teamId, configs, boardId } = addCronJobDto;
		try {
			const cronJobDoc = await this.schedulesModel.create({
				...addCronJobDto.configs,
				board: boardId,
				team: teamId,
				owner: ownerId,
				willRunAt: new Date(new Date().getFullYear(), month, day, 10)
			});
			if (!cronJobDoc) throw Error('CronJob not created');
			const job = new CronJob(`0 10 ${day} ${month} *`, () => {
				return this.handleComplete(configs, ownerId, teamId, cronJobDoc.board.toString());
			});
			this.schedulerRegistry.addCronJob(boardId, job);
			job.start();
		} catch (e) {
			await this.schedulesModel.deleteOne({ board: boardId });
			this.schedulerRegistry.deleteCronJob(boardId);
		}
	}

	async handleComplete(configs: Configs, ownerId: string, teamId: string, oldBoardId: string) {
		try {
			await this.schedulesModel.deleteOne({ board: oldBoardId });
			this.schedulerRegistry.deleteCronJob(oldBoardId);

			const day = getDay();
			const month = getNextMonth();

			const boardId = await this.createBoardService.splitBoardByTeam(ownerId, teamId, configs);

			const addCronJobDto: AddCronJobDto = {
				ownerId,
				teamId,
				configs,
				boardId
			};

			this.addCronJob(day, month, addCronJobDto);
		} catch (e) {
			// TODO send message to dev
			throw Error(DELETE_FAILED);
		}
	}
}

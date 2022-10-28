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
import { GetBoardServiceInterface } from 'modules/boards/interfaces/services/get.board.service.interface';

@Injectable()
export class CreateSchedulesService implements CreateSchedulesServiceInterface {
	constructor(
		@InjectModel(Schedules.name)
		private schedulesModel: Model<SchedulesDocument>,
		@Inject(forwardRef(() => BoardTypes.TYPES.services.CreateBoardService))
		private createBoardService: CreateBoardService,
		@Inject(forwardRef(() => BoardTypes.TYPES.services.GetBoardService))
		private getBoardService: GetBoardServiceInterface,
		private schedulerRegistry: SchedulerRegistry
	) {
		this.createInitialJobs()
	}

	async createInitialJobs() {
		const schedules = await this.schedulesModel.find()
		schedules.forEach(async (schedule) => {
			let day = schedule.willRunAt.getDay()
			let month = schedule.willRunAt.getMonth()
			await this.addCronJob(day, month, this.mapScheduleDocumentToDto(schedule))
		})
	}

	private mapScheduleDocumentToDto(schedule: SchedulesDocument): AddCronJobDto {
		return {
			boardId: String(schedule.board),
			teamId: String(schedule.team),
			ownerId: String(schedule.owner),
			maxUsersPerTeam: schedule.maxUsers,
		}
	}

	async addCronJob(day: number, month: number, addCronJobDto: AddCronJobDto) {
		const { ownerId, teamId, boardId, maxUsersPerTeam } = addCronJobDto;
		try {
			const cronJobDoc = await this.schedulesModel.create({
				board: boardId,
				team: teamId,
				owner: ownerId,
				maxUsers: maxUsersPerTeam,
				willRunAt: new Date(new Date().getFullYear(), month, day, 10)
			});
			if (!cronJobDoc) throw Error('CronJob not created');
			// const job = new CronJob(`0 10 ${day} ${month} *`, () => {
			const job = new CronJob(`10 * * * * *`, () => {
				return this.handleComplete(ownerId, teamId, cronJobDoc.board.toString());
			});
			this.schedulerRegistry.addCronJob(boardId, job);
			job.start();
		} catch (e) {
			await this.schedulesModel.deleteOne({ board: boardId });
			this.schedulerRegistry.deleteCronJob(boardId);
		}
	}

	async handleComplete(ownerId: string, teamId: string, oldBoardId: string) {
		try {
			console.log(oldBoardId)
			const deletedSchedule = await this.schedulesModel.findOneAndDelete({ board: oldBoardId });
			this.schedulerRegistry.deleteCronJob(oldBoardId);

			const day = getDay();
			const month = getNextMonth();

			const board = await this.getBoardService.getBoardFromRepo(oldBoardId);
			if (!board || !deletedSchedule) return

			const configs: Configs = {
				recurrent: board.recurrent,
				maxVotes: board.maxVotes,
				hideCards: board.hideCards,
				hideVotes: board.hideVotes,
				maxUsersPerTeam: deletedSchedule.maxUsers,
				slackEnable: board.slackEnable ?? false
			}

			console.log(configs);

			const boardId = await this.createBoardService.splitBoardByTeam(ownerId, teamId, configs);

			const addCronJobDto: AddCronJobDto = {
				ownerId,
				teamId,
				boardId: boardId ?? oldBoardId,
				maxUsersPerTeam: deletedSchedule.maxUsers
			};

			this.addCronJob(day, month, addCronJobDto);
		} catch (e) {
			// TODO send message to dev
			console.log(e)
			throw Error(DELETE_FAILED);
		}
	}
}

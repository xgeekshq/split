import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { LeanDocument, Model } from 'mongoose';

import { DELETE_FAILED } from 'libs/exceptions/messages';
import { getDay, getNextMonth } from 'libs/utils/dates';
import {
	Configs,
	CreateBoardService
} from 'modules/boards/interfaces/services/create.board.service.interface';
import { GetBoardServiceInterface } from 'modules/boards/interfaces/services/get.board.service.interface';
import * as BoardTypes from 'modules/boards/interfaces/types';
import { BoardDocument } from 'modules/boards/schemas/board.schema';

import { AddCronJobDto } from '../dto/add.cronjob.dto';
import { CreateSchedulesServiceInterface } from '../interfaces/services/create.schedules.service.interface';
import { DeleteSchedulesServiceInterface } from '../interfaces/services/delete.schedules.service.interface';
import { TYPES } from '../interfaces/types';
import Schedules, { SchedulesDocument } from '../schemas/schedules.schema';

@Injectable()
export class CreateSchedulesService implements CreateSchedulesServiceInterface {
	private logger = new Logger(CreateSchedulesService.name);

	constructor(
		@InjectModel(Schedules.name)
		private schedulesModel: Model<SchedulesDocument>,
		@Inject(forwardRef(() => TYPES.services.DeleteSchedulesService))
		private deleteSchedulesService: DeleteSchedulesServiceInterface,
		@Inject(forwardRef(() => BoardTypes.TYPES.services.CreateBoardService))
		private createBoardService: CreateBoardService,
		@Inject(forwardRef(() => BoardTypes.TYPES.services.GetBoardService))
		private getBoardService: GetBoardServiceInterface,
		private schedulerRegistry: SchedulerRegistry
	) {
		this.createInitialJobs();
	}

	private async createInitialJobs() {
		const schedules = await this.schedulesModel.find();
		schedules.forEach(async (schedule) => {
			const date = new Date(schedule.willRunAt);
			const day = date.getUTCDate();
			const month = date.getUTCMonth();
			await this.deleteSchedulesService.findAndDeleteScheduleByBoardId(String(schedule.board));
			await this.addCronJob(day, month, this.mapScheduleDocumentToDto(schedule));
		});
	}

	private mapScheduleDocumentToDto(schedule: SchedulesDocument): AddCronJobDto {
		return {
			boardId: String(schedule.board),
			teamId: String(schedule.team),
			ownerId: String(schedule.owner),
			maxUsersPerTeam: schedule.maxUsers
		};
	}

	async addCronJob(day: number, month: number, addCronJobDto: AddCronJobDto) {
		const { ownerId, teamId, boardId, maxUsersPerTeam } = addCronJobDto;
		try {
			const cronJobDoc = await this.schedulesModel.create({
				board: String(boardId),
				team: String(teamId),
				owner: String(ownerId),
				maxUsers: maxUsersPerTeam,
				willRunAt: new Date(new Date().getFullYear(), month, day, 10).toISOString()
			});
			if (!cronJobDoc) throw Error('CronJob not created');
			const job = new CronJob(`0 10 18 10 *`, () =>
				// const job = new CronJob(`0 10 ${day} ${month} *`, () =>
				this.handleComplete(String(ownerId), teamId, cronJobDoc.board.toString())
			);
			this.schedulerRegistry.addCronJob(String(boardId), job);
			job.start();
		} catch (e) {
			this.logger.log(e);
			await this.schedulesModel.deleteOne({ board: boardId });
		}
	}

	async handleComplete(ownerId: string, teamId: string, oldBoardId: string) {
		try {
			const deletedSchedule = await this.deleteSchedulesService.findAndDeleteScheduleByBoardId(
				oldBoardId
			);
			const oldBoard = await this.getBoardService.getBoardFromRepo(oldBoardId);
			if (!oldBoard) {
				await this.deleteSchedulesService.deleteScheduleByBoardId(oldBoardId);
				return;
			}

			if (!deletedSchedule) return;

			this.createSchedule(oldBoard, deletedSchedule, ownerId, teamId, oldBoardId);
		} catch (e) {
			throw Error(DELETE_FAILED);
		}
	}

	async createSchedule(
		oldBoard: LeanDocument<BoardDocument>,
		deletedSchedule: SchedulesDocument,
		ownerId: string,
		teamId: string,
		oldBoardId: string
	) {
		const day = getDay();
		const month = getNextMonth();

		const configs: Configs = {
			recurrent: oldBoard.recurrent,
			maxVotes: oldBoard.maxVotes,
			hideCards: oldBoard.hideCards,
			hideVotes: oldBoard.hideVotes,
			maxUsersPerTeam: deletedSchedule.maxUsers,
			slackEnable: oldBoard.slackEnable ?? false,
			date: new Date(new Date().getFullYear(), month - 1, day, 10)
		};

		const boardId = await this.createBoardService.splitBoardByTeam(ownerId, teamId, configs);
		if (!boardId) {
			await this.deleteSchedulesService.deleteScheduleByBoardId(oldBoardId);
			return;
		}

		const addCronJobDto: AddCronJobDto = {
			ownerId,
			teamId,
			boardId: boardId ?? oldBoardId,
			maxUsersPerTeam: deletedSchedule.maxUsers
		};

		this.addCronJob(day, month - 1, addCronJobDto);
	}
}

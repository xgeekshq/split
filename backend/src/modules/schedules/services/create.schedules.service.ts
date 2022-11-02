import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Model, LeanDocument } from 'mongoose';

import { DELETE_FAILED } from 'libs/exceptions/messages';
import { getDay, getNextMonth } from 'libs/utils/dates';
import {
	Configs,
	CreateBoardService
} from 'modules/boards/interfaces/services/create.board.service.interface';
import * as BoardTypes from 'modules/boards/interfaces/types';
import { TYPES } from "../interfaces/types"

import { AddCronJobDto } from '../dto/add.cronjob.dto';
import { CreateSchedulesServiceInterface } from '../interfaces/services/create.schedules.service.interface';
import Schedules, { SchedulesDocument } from '../schemas/schedules.schema';
import { GetBoardServiceInterface } from 'modules/boards/interfaces/services/get.board.service.interface';
import { BoardDocument } from 'modules/boards/schemas/board.schema';
import { DeleteSchedulesServiceInterface } from '../interfaces/services/delete.schedules.service.interface';

@Injectable()
export class CreateSchedulesService implements CreateSchedulesServiceInterface {
	constructor(
		@InjectModel(Schedules.name)
		private schedulesModel: Model<SchedulesDocument>,
		@Inject(forwardRef(() => TYPES.services.DeleteSchedulesService))
		private deleteSchedulesService: DeleteSchedulesServiceInterface,
		@Inject(forwardRef(() => BoardTypes.TYPES.services.CreateBoardService))
		private createBoardService: CreateBoardService,
		@Inject(forwardRef(() => BoardTypes.TYPES.services.GetBoardService))
		private getBoardService: GetBoardServiceInterface,
		private schedulerRegistry: SchedulerRegistry,
	) {
		this.createInitialJobs()
	}

	private async createInitialJobs() {
		const schedules = await this.schedulesModel.find()
		schedules.forEach(async (schedule) => {
			let date = new Date(schedule.willRunAt)
			let day = date.getUTCDate()
			let month = date.getUTCMonth() + 1
			await this.deleteSchedulesService.findAndDeleteScheduleByBoardId(String(schedule.board))
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
		console.log("ADD CRON JOB")
		const { ownerId, teamId, boardId, maxUsersPerTeam } = addCronJobDto;
		try {
			const cronJobDoc = await this.schedulesModel.create({
				board: boardId,
				team: teamId,
				owner: ownerId,
				maxUsers: maxUsersPerTeam,
				willRunAt: new Date(new Date().getFullYear(), month - 1, day, 10).toISOString()
			});
			console.log(day, month, new Date(new Date().getFullYear(), month - 1, day, 10))
			if (!cronJobDoc) throw Error('CronJob not created');
			const job = new CronJob(`0 10 ${day} ${month} *`, () => this.handleComplete(ownerId, teamId, cronJobDoc.board.toString()));
			this.schedulerRegistry.addCronJob(boardId, job);
			job.start();
		} catch (e) {
			await this.schedulesModel.deleteOne({ board: boardId });
		}
	}

	async handleComplete(ownerId: string, teamId: string, oldBoardId: string) {
		try {
			const deletedSchedule = await this.deleteSchedulesService.findAndDeleteScheduleByBoardId(oldBoardId)
			const oldBoard = await this.getBoardService.getBoardFromRepo(oldBoardId);
			if (!oldBoard) {
				await this.deleteSchedulesService.deleteScheduleByBoardId(oldBoardId)
				return
			}

			if (!deletedSchedule) return

			this.createSchedule(oldBoard, deletedSchedule, ownerId, teamId, oldBoardId)
		} catch (e) {
			throw Error(DELETE_FAILED);
		}
	}

	async createSchedule(oldBoard: LeanDocument<BoardDocument>, deletedSchedule: SchedulesDocument, ownerId: string, teamId: string, oldBoardId: string) {
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
		}

		const boardId = await this.createBoardService.splitBoardByTeam(ownerId, teamId, configs);
		if (!boardId) {
			await this.deleteSchedulesService.deleteScheduleByBoardId(oldBoardId)
			return
		}

		const addCronJobDto: AddCronJobDto = {
			ownerId,
			teamId,
			boardId: boardId ?? oldBoardId,
			maxUsersPerTeam: deletedSchedule.maxUsers
		};

		this.addCronJob(day, month, addCronJobDto);
	}
}

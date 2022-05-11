import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import {
  Configs,
  CreateBoardService,
} from '../../boards/interfaces/services/create.board.service.interface';
import * as BoardTypes from '../../boards/interfaces/types';
import { AddCronJobDto } from '../dto/add.cronjob.dto';
import Schedules, { SchedulesDocument } from '../schemas/schedules.schema';
import { CreateSchedulesServiceInterface } from '../interfaces/services/create.schedules.service';
import { getDay, getNextMonth } from '../../../libs/utils/dates';

@Injectable()
export class CreateSchedulesService implements CreateSchedulesServiceInterface {
  constructor(
    @InjectModel(Schedules.name)
    private schedulesModel: Model<SchedulesDocument>,
    @Inject(forwardRef(() => BoardTypes.TYPES.services.CreateBoardService))
    private createBoardService: CreateBoardService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async addCronJob(day: number, month: number, addCronJobDto: AddCronJobDto) {
    const { ownerId, teamId, configs, boardId } = addCronJobDto;
    try {
      const cronJobDoc = await this.schedulesModel.create({
        ...addCronJobDto.configs,
        board: boardId,
        team: teamId,
        owner: ownerId,
        willRunAt: new Date(new Date().getFullYear(), month, day, 10),
      });
      if (!cronJobDoc) throw Error('CronJob not created');
      const job = new CronJob(`0 10 ${day} ${month} *`, () => {
        return this.handleComplete(
          job,
          configs,
          ownerId,
          teamId,
          cronJobDoc.board.toString(),
        );
      });
      this.schedulerRegistry.addCronJob(boardId, job);
      job.start();
    } catch (e) {
      await this.schedulesModel.deleteOne({ board: boardId });
      this.schedulerRegistry.deleteCronJob(boardId);
    }
  }

  handleComplete(
    job: CronJob,
    configs: Configs,
    ownerId: string,
    teamId: string,
    boardId: string,
  ) {
    const day = getDay();
    const month = getNextMonth();

    this.createBoardService
      .splitBoardByTeam(ownerId, teamId, configs)
      .then(async () => {
        await this.schedulesModel.deleteOne({
          board: boardId,
        });
        await this.schedulesModel.create({
          ...configs,
          board: boardId,
          team: teamId,
          owner: ownerId,
          willRunAt: new Date(new Date().getFullYear(), month, day, 10),
        });
      });

    job.setTime(new CronTime(`0 10 ${day} ${month} *`));
    job.start();
  }
}

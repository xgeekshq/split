import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { SchedulerRegistry } from '@nestjs/schedule';
import SocketGateway from '../../src/modules/socket/gateway/socket.gateway';
import BoardsController from '../../src/modules/boards/controller/boards.controller';
import {
  createBoardApplication,
  createBoardService,
  deleteBoardApplication,
  deleteBoardService,
  getBoardApplication,
  getBoardService,
  updateBoardApplication,
  updateBoardService,
} from '../../src/modules/boards/boards.providers';
import {
  createTeamService,
  getTeamApplication,
  getTeamService,
} from '../../src/modules/teams/providers';
import { createSchedulesService } from '../../src/modules/schedules/schedules.providers';

describe('BoardsController', () => {
  let controller: BoardsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [
        SchedulerRegistry,
        SocketGateway,
        createBoardApplication,
        createBoardService,
        getBoardApplication,
        getBoardService,
        getTeamService,
        getTeamApplication,
        updateBoardApplication,
        updateBoardService,
        deleteBoardApplication,
        deleteBoardService,
        createSchedulesService,
        createTeamService,
        {
          provide: getModelToken('User'),
          useValue: {},
        },
        {
          provide: getModelToken('Board'),
          useValue: {},
        },
        {
          provide: getModelToken('BoardUser'),
          useValue: {},
        },
        {
          provide: getModelToken('Team'),
          useValue: {},
        },
        {
          provide: getModelToken('TeamUser'),
          useValue: {},
        },
        {
          provide: getModelToken('Schedules'),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BoardsController>(BoardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

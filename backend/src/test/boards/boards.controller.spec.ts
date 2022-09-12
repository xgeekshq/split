import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';

import {
	createBoardApplication,
	createBoardService,
	deleteBoardApplication,
	deleteBoardService,
	getBoardApplication,
	getBoardService,
	updateBoardApplication,
	updateBoardService
} from 'modules/boards/boards.providers';
import BoardsController from 'modules/boards/controller/boards.controller';
import * as CommunicationsType from 'modules/communication/interfaces/types';
import { createSchedulesService } from 'modules/schedules/schedules.providers';
import SocketGateway from 'modules/socket/gateway/socket.gateway';
import { createTeamService, getTeamApplication, getTeamService } from 'modules/teams/providers';

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
					useValue: {}
				},
				{
					provide: getModelToken('Board'),
					useValue: {}
				},
				{
					provide: getModelToken('BoardUser'),
					useValue: {}
				},
				{
					provide: getModelToken('Team'),
					useValue: {}
				},
				{
					provide: getModelToken('TeamUser'),
					useValue: {}
				},
				{
					provide: getModelToken('Schedules'),
					useValue: {}
				},
				{
					provide: CommunicationsType.TYPES.services.ExecuteCommunication,
					useValue: {
						execute: jest.fn()
					}
				}
			]
		}).compile();

		controller = module.get<BoardsController>(BoardsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

import { EventEmitterModule } from '@nestjs/event-emitter';
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
} from 'src/modules/boards/boards.providers';
import BoardsController from 'src/modules/boards/controller/boards.controller';
import { getCardService } from 'src/modules/cards/cards.providers';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import {
	createSchedulesService,
	deleteSchedulesService
} from 'src/modules/schedules/schedules.providers';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import {
	createTeamService,
	getTeamApplication,
	getTeamService,
	teamRepository,
	teamUserRepository,
	updateTeamService
} from 'src/modules/teams/providers';
import { deleteVoteService } from 'src/modules/votes/votes.providers';

describe('BoardsController', () => {
	let controller: BoardsController;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [EventEmitterModule.forRoot()],
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
				createTeamService,
				createSchedulesService,
				deleteSchedulesService,
				teamRepository,
				teamUserRepository,
				updateTeamService,
				deleteVoteService,
				getCardService,
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
					useValue: {
						find: jest.fn().mockResolvedValue([])
					}
				},
				{
					provide: CommunicationsType.TYPES.services.SlackCommunicationService,
					useValue: {
						execute: jest.fn()
					}
				},
				{
					provide: CommunicationsType.TYPES.services.SlackArchiveChannelService,
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

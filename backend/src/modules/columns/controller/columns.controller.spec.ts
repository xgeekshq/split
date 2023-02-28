import { ConfigService } from '@nestjs/config';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import {
	boardRepository,
	createBoardService,
	getBoardApplication,
	getBoardService,
	updateBoardApplication,
	updateBoardService
} from 'src/modules/boards/boards.providers';
import { deleteCardService, getCardService } from 'src/modules/cards/cards.providers';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import {
	createSchedulesService,
	deleteSchedulesService
} from 'src/modules/schedules/schedules.providers';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import {
	getTeamApplication,
	getTeamService,
	teamRepository,
	teamUserRepository,
	updateTeamService
} from 'src/modules/teams/providers';
import { userRepository } from 'src/modules/users/users.providers';
import { deleteVoteService } from 'src/modules/votes/votes.providers';
import {
	columnRepository,
	updateColumnApplication,
	updateColumnService
} from '../columns.providers';
import ColumnsController from './columns.controller';

describe('ColumnsController', () => {
	let controller: ColumnsController;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [EventEmitterModule.forRoot()],
			controllers: [ColumnsController],
			providers: [
				SchedulerRegistry,
				SocketGateway,
				updateColumnApplication,
				updateColumnService,
				getBoardApplication,
				getBoardService,
				getTeamService,
				getTeamApplication,
				updateBoardApplication,
				updateBoardService,
				deleteVoteService,
				getCardService,
				deleteCardService,
				teamRepository,
				teamUserRepository,
				deleteVoteService,
				columnRepository,
				boardRepository,
				userRepository,
				createSchedulesService,
				deleteSchedulesService,
				createBoardService,
				updateTeamService,
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
					provide: ConfigService,
					useValue: configService
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
				},
				{
					provide: CommunicationsType.TYPES.services.SlackSendMessageService,
					useValue: {
						execute: jest.fn()
					}
				}
			]
		}).compile();

		controller = module.get<ColumnsController>(ColumnsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

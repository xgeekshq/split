import { voteBoardRepository, voteBoardUserRepository } from './../../votes/votes.providers';
import { ConfigService } from '@nestjs/config';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import {
	boardRepository,
	boardUserRepository,
	createBoardApplication,
	createBoardService,
	createBoardUserService,
	deleteBoardApplication,
	deleteBoardService,
	getBoardApplication,
	getBoardService,
	updateBoardApplication,
	updateBoardService
} from 'src/modules/boards/boards.providers';
import BoardsController from 'src/modules/boards/controller/boards.controller';
import { deleteCardService, getCardService } from 'src/modules/cards/cards.providers';
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
import { updateUserService, userRepository } from 'src/modules/users/users.providers';
import { deleteVoteService } from 'src/modules/votes/votes.providers';
import { JwtService } from '@nestjs/jwt';
import jwtService from 'src/libs/test-utils/mocks/jwtService.mock';
import { getTokenAuthService } from 'src/modules/auth/auth.providers';

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
				boardUserRepository,
				teamUserRepository,
				updateTeamService,
				getCardService,
				deleteCardService,
				deleteVoteService,
				boardRepository,
				userRepository,
				updateTeamService,
				createBoardUserService,
				getTokenAuthService,
				updateUserService,
				getBoardService,
				voteBoardRepository,
				voteBoardUserRepository,
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
				},
				{
					provide: getModelToken('ResetPassword'),
					useValue: {}
				},
				{
					provide: JwtService,
					useValue: jwtService
				}
			]
		}).compile();

		controller = module.get<BoardsController>(BoardsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

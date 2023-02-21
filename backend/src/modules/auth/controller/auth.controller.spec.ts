import { EventEmitterModule } from '@nestjs/event-emitter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import jwtService from 'src/libs/test-utils/mocks/jwtService.mock';
import mockedUser from 'src/libs/test-utils/mocks/user.mock';
import {
	createResetTokenAuthApplication,
	createResetTokenAuthService,
	getTokenAuthApplication,
	getTokenAuthService,
	registerAuthApplication,
	registerAuthService
} from 'src/modules/auth/auth.providers';
import AuthController from 'src/modules/auth/controller/auth.controller';
import {
	boardRepository,
	createBoardService,
	getBoardApplication,
	getBoardService
} from 'src/modules/boards/boards.providers';
import EmailModule from 'src/modules/mailer/mailer.module';
import {
	createTeamService,
	getTeamApplication,
	getTeamService,
	teamRepository,
	teamUserRepository,
	updateTeamService
} from 'src/modules/teams/providers';
import {
	createUserService,
	getUserApplication,
	getUserService,
	updateUserApplication,
	updateUserService,
	userRepository
} from 'src/modules/users/users.providers';
import {
	createSchedulesService,
	deleteSchedulesService
} from 'src/modules/schedules/schedules.providers';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import { SchedulerRegistry } from '@nestjs/schedule';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

describe('AuthController', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const usersRepository = {
			create: jest.fn().mockResolvedValue(mockedUser),
			save: jest.fn().mockReturnValue(Promise.resolve())
		};

		const module: TestingModule = await Test.createTestingModule({
			imports: [EmailModule, EventEmitterModule.forRoot()],
			controllers: [AuthController],
			providers: [
				registerAuthApplication,
				getTokenAuthApplication,
				getTokenAuthService,
				createTeamService,
				getTeamService,
				getTeamApplication,
				getBoardApplication,
				getBoardService,
				registerAuthService,
				updateUserService,
				updateUserApplication,
				createResetTokenAuthApplication,
				createResetTokenAuthService,
				createUserService,
				getUserApplication,
				getUserService,
				userRepository,
				teamRepository,
				teamUserRepository,
				updateTeamService,
				boardRepository,
				createBoardService,
				createSchedulesService,
				deleteSchedulesService,
				SocketGateway,
				SchedulerRegistry,
				ConfigService,
				{
					provide: CommunicationsType.TYPES.services.SlackCommunicationService,
					useValue: {
						execute: jest.fn()
					}
				},
				{
					provide: getModelToken('Schedules'),
					useValue: {
						find: jest.fn().mockResolvedValue([])
					}
				},
				{
					provide: CommunicationsType.TYPES.services.SlackArchiveChannelService,
					useValue: {
						execute: jest.fn()
					}
				},
				{
					provide: ConfigService,
					useValue: configService
				},
				{
					provide: JwtService,
					useValue: jwtService
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
					provide: getModelToken('User'),
					useValue: usersRepository
				},
				{
					provide: getModelToken('ResetPassword'),
					useValue: {}
				},
				{
					provide: getModelToken('Team'),
					useValue: {}
				},
				{
					provide: getModelToken('TeamUser'),
					useValue: {}
				}
			]
		}).compile();

		app = module.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();
	});

	describe('when registering', () => {
		describe('and using invalid data', () => {
			it('should throw an error because full data wasnt submitted', () =>
				request(app.getHttpServer())
					.post('/auth/register')
					.send({ name: '', password: '', email: '' })
					.expect(400));
			it('should throw an error because full data wasnt submitted', async () =>
				request(app.getHttpServer())
					.post('/auth/register')
					.send({
						firstName: mockedUser.firstName,
						lastName: mockedUser.lastName
					})
					.expect(400));
			it('should throw an error because full data wasnt submitted', async () =>
				request(app.getHttpServer())
					.post('/auth/register')
					.send({
						firstName: mockedUser.firstName,
						lastName: mockedUser.lastName,
						password: mockedUser.password
					})
					.expect(400));
			it('should throw an error because password is short', async () => {
				const res = await request(app.getHttpServer()).post('/auth/register').send({
					firstName: mockedUser.firstName,
					lastName: mockedUser.lastName,
					password: '1234',
					email: mockedUser.email
				});

				expect(res.body.message[0]).toBe(
					'Use at least 8 characters, upper and lower case letters, numbers and symbols like !“?$%^&).'
				);
			});
		});
	});
});

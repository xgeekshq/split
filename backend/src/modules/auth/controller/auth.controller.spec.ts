import { EventEmitterModule } from '@nestjs/event-emitter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import mockedUser from 'src/libs/test-utils/mocks/user.mock';
import AuthController from 'src/modules/auth/controller/auth.controller';
import EmailModule from 'src/modules/mailer/mailer.module';
import * as Auth from 'src/modules/auth/interfaces/types';
import * as Teams from 'src/modules/teams/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as User from 'src/modules/users/interfaces/types';
import { createMock } from '@golevelup/ts-jest';
import { RegisterAuthApplication } from '../applications/register.auth.application';
import { GetTeamApplication } from 'src/modules/teams/applications/get.team.application';
import { CreateResetTokenAuthApplication } from '../applications/create-reset-token.use-case';
import { UpdateUserApplication } from 'src/modules/users/use-cases/update.user.application';
import { GetBoardApplication } from 'src/modules/boards/applications/get.board.application';
import { GetUserApplication } from 'src/modules/users/use-cases/get.user.application';

describe('AuthController', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [EmailModule, EventEmitterModule.forRoot()],
			controllers: [AuthController],
			providers: [
				{
					provide: Auth.TYPES.applications.RegisterAuthApplication,
					useValue: createMock<RegisterAuthApplication>()
				},
				{
					provide: Auth.TYPES.applications.GetTokenAuthApplication,
					useValue: createMock<GetTeamApplication>()
				},
				{
					provide: Auth.TYPES.applications.CreateResetTokenAuthApplication,
					useValue: createMock<CreateResetTokenAuthApplication>()
				},
				{
					provide: Auth.TYPES.applications.UpdateUserApplication,
					useValue: createMock<UpdateUserApplication>()
				},
				{
					provide: Teams.TYPES.applications.GetTeamApplication,
					useValue: createMock<GetTeamApplication>()
				},
				{
					provide: Boards.TYPES.applications.GetBoardApplication,
					useValue: createMock<GetBoardApplication>()
				},
				{
					provide: User.TYPES.applications.GetUserApplication,
					useValue: createMock<GetUserApplication>()
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

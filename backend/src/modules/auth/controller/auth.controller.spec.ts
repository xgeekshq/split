import { EventEmitterModule } from '@nestjs/event-emitter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import mockedUser from 'src/libs/test-utils/mocks/user.mock';
import AuthController from 'src/modules/auth/controller/auth.controller';
import EmailModule from 'src/modules/mailer/mailer.module';
import { RegisterUserUseCaseInterface } from '../interfaces/applications/register-user.use-case.interface';
import { RegisterGuestUserUseCaseInterface } from '../interfaces/applications/register-guest-user.use-case.interface';
import { ValidateUserEmailUseCaseInterface } from '../interfaces/applications/validate-email.use-case.interface';
import { RefreshTokenUseCaseInterface } from '../interfaces/applications/refresh-token.use-case.interface';
import { StatisticsAuthUserUseCaseInterface } from '../interfaces/applications/statistics.auth.use-case.interface';
import { ResetPasswordUseCaseInterface } from '../interfaces/applications/reset-password.use-case.interface';
import { CreateResetTokenUseCaseInterface } from '../interfaces/applications/create-reset-token.use-case.interface';
import { SignInUseCaseInterface } from '../interfaces/applications/signIn.use-case.interface';
import { TYPES } from '../interfaces/types';
import { createMock } from '@golevelup/ts-jest';
import { ResetPasswordRepositoryInterface } from '../repository/reset-password.repository.interface';
import { getModelToken } from '@nestjs/mongoose';

describe('AuthController', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [EmailModule, EventEmitterModule.forRoot()],
			controllers: [AuthController],
			providers: [
				{
					provide: TYPES.applications.RegisterUserUseCase,
					useValue: createMock<RegisterUserUseCaseInterface>()
				},
				{
					provide: TYPES.applications.RegisterGuestUserUseCase,
					useValue: createMock<RegisterGuestUserUseCaseInterface>()
				},
				{
					provide: TYPES.applications.ValidateUserEmailUseCase,
					useValue: createMock<ValidateUserEmailUseCaseInterface>()
				},
				{
					provide: TYPES.applications.RefreshTokenUseCase,
					useValue: createMock<RefreshTokenUseCaseInterface>()
				},
				{
					provide: TYPES.applications.StatisticsAuthUserUseCase,
					useValue: createMock<StatisticsAuthUserUseCaseInterface>()
				},
				{
					provide: TYPES.applications.ResetPasswordUseCase,
					useValue: createMock<ResetPasswordUseCaseInterface>()
				},
				{
					provide: TYPES.applications.CreateResetTokenUseCase,
					useValue: createMock<CreateResetTokenUseCaseInterface>()
				},
				{
					provide: TYPES.applications.SignInUseCase,
					useValue: createMock<SignInUseCaseInterface>()
				},
				{
					provide: getModelToken('ResetPassword'),
					useValue: {}
				},
				{
					provide: TYPES.repository.ResetPasswordRepository,
					useValue: createMock<ResetPasswordRepositoryInterface>()
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

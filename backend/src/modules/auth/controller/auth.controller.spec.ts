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
import { CreateResetPasswordTokenUseCaseInterface } from '../interfaces/applications/create-reset-token.use-case.interface';
import { SignInUseCaseInterface } from '../interfaces/applications/signIn.use-case.interface';
import { createMock } from '@golevelup/ts-jest';
import { ResetPasswordRepositoryInterface } from '../repository/reset-password.repository.interface';
import {
	CREATE_RESET_PASSWORD_TOKEN_USE_CASE,
	REFRESH_TOKEN_USE_CASE,
	REGISTER_GUEST_USER_USE_CASE,
	REGISTER_USER_USE_CASE,
	RESET_PASSWORD_REPOSITORY,
	RESET_PASSWORD_USE_CASE,
	SIGN_IN_USE_CASE,
	STATISTICS_AUTH_USER_USE_CASE,
	VALIDATE_USER_EMAIL_USE_CASE
} from 'src/modules/auth/constants';

describe('AuthController', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [EmailModule, EventEmitterModule.forRoot()],
			controllers: [AuthController],
			providers: [
				{
					provide: REGISTER_USER_USE_CASE,
					useValue: createMock<RegisterUserUseCaseInterface>()
				},
				{
					provide: REGISTER_GUEST_USER_USE_CASE,
					useValue: createMock<RegisterGuestUserUseCaseInterface>()
				},
				{
					provide: VALIDATE_USER_EMAIL_USE_CASE,
					useValue: createMock<ValidateUserEmailUseCaseInterface>()
				},
				{
					provide: REFRESH_TOKEN_USE_CASE,
					useValue: createMock<RefreshTokenUseCaseInterface>()
				},
				{
					provide: STATISTICS_AUTH_USER_USE_CASE,
					useValue: createMock<StatisticsAuthUserUseCaseInterface>()
				},
				{
					provide: RESET_PASSWORD_USE_CASE,
					useValue: createMock<ResetPasswordUseCaseInterface>()
				},
				{
					provide: CREATE_RESET_PASSWORD_TOKEN_USE_CASE,
					useValue: createMock<CreateResetPasswordTokenUseCaseInterface>()
				},
				{
					provide: SIGN_IN_USE_CASE,
					useValue: createMock<SignInUseCaseInterface>()
				},
				// {
				// 	provide: getModelToken('ResetPassword'),
				// 	useValue: {}
				// },
				{
					provide: RESET_PASSWORD_REPOSITORY,
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

import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import ValidateUserAuthService from 'src/modules/auth/services/validate-user.auth.service';
import { RESET_PASSWORD_REPOSITORY } from 'src/modules/auth/constants';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ResetPasswordRepositoryInterface } from 'src/modules/auth/repository/reset-password.repository.interface';
import { TYPES } from 'src/modules/users/interfaces/types';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';

jest.mock('bcrypt');
jest.mock('src/modules/schedules/services/create.schedules.service.ts');
jest.mock('src/modules/schedules/services/delete.schedules.service.ts');

const user = UserFactory.create();

describe('The AuthenticationService', () => {
	let authenticationService: ValidateUserAuthService;
	let getUserServiceMock: DeepMocked<GetUserServiceInterface>;
	let bcryptCompare: jest.Mock;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [EventEmitterModule.forRoot()],
			providers: [
				ValidateUserAuthService,
				{
					provide: RESET_PASSWORD_REPOSITORY,
					useValue: createMock<ResetPasswordRepositoryInterface>()
				},
				{
					provide: TYPES.services.GetUserService,
					useValue: createMock<GetUserServiceInterface>()
				}
			]
		}).compile();
		authenticationService = await module.get(ValidateUserAuthService);
		getUserServiceMock = await module.get(TYPES.services.GetUserService);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();

		getUserServiceMock.getByEmail.mockResolvedValue(user);
		bcryptCompare = jest.fn().mockReturnValue(true);
		(bcrypt.compare as jest.Mock) = bcryptCompare;
	});

	describe('when accessing the data of authenticating user', () => {
		it('should attempt to get a user by email', async () => {
			await authenticationService.validateUserWithCredentials('user@email.com', 'strongPassword');
			expect(getUserServiceMock.getByEmail).toBeCalledTimes(1);
		});
		describe('and the provided password is not valid', () => {
			beforeEach(() => {
				bcryptCompare.mockReturnValue(false);
			});
			it('should throw an error', async () => {
				expect(
					await authenticationService.validateUserWithCredentials(user.email, 'strongPassword')
				).toEqual(null);
			});
		});
		describe('and the provided password is valid', () => {
			beforeEach(() => {
				bcryptCompare.mockReturnValue(true);
			});
			describe('and the user is found in the database', () => {
				it('should return the user data', async () => {
					const userResult = await authenticationService.validateUserWithCredentials(
						user.email,
						user.password
					);
					expect(userResult).toBe(user);
				});
			});
			describe('and the user is not found in the database', () => {
				it('should throw an error', async () => {
					getUserServiceMock.getByEmail.mockResolvedValue(null);
					await expect(
						authenticationService.validateUserWithCredentials(user.email, 'strongPassword')
					).resolves.toEqual(null);
				});
			});
		});
	});
});

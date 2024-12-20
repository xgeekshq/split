import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { faker } from '@faker-js/faker';
import { UserNotFoundException } from 'src/libs/exceptions/userNotFoundException';
import { ResetPasswordFactory } from './../../../libs/test-utils/mocks/factories/resetPassword-factory.mock';
import ResetPassword from 'src/modules/auth/entities/reset-password.schema';
import { BadRequestException, HttpException } from '@nestjs/common';
import { PasswordsDontMatchException } from './../exceptions/passwordsDontMatchException';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';
import { UserRepositoryInterface } from './../repository/user.repository.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import User from '../entities/user.schema';
import { VALIDATE_AUTH_SERVICE } from 'src/modules/auth/constants';
import { ValidateUserAuthServiceInterface } from 'src/modules/auth/interfaces/services/validate-user.auth.service.interface';
import { USER_REPOSITORY } from 'src/modules/users/constants';
import UpdateUserService from 'src/modules/users/services/update.user.service';

const user: User = UserFactory.create();

const resetPassword: ResetPassword = ResetPasswordFactory.create({ emailAddress: user.email });

const updatedUser: User = {
	...user,
	password: resetPassword.newPassword
};

const url = faker.internet.url();

describe('UpdateUserService', () => {
	let userService: UpdateUserServiceInterface;
	let userRepositoryMock: DeepMocked<UserRepositoryInterface>;
	let validateAuthServiceMock: DeepMocked<ValidateUserAuthServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateUserService,
				{
					provide: USER_REPOSITORY,
					useValue: createMock<UserRepositoryInterface>()
				},
				{
					provide: VALIDATE_AUTH_SERVICE,
					useValue: createMock<ValidateUserAuthServiceInterface>()
				}
			]
		}).compile();

		userService = module.get(UpdateUserService);
		userRepositoryMock = module.get(USER_REPOSITORY);
		validateAuthServiceMock = module.get(VALIDATE_AUTH_SERVICE);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
	});

	describe('setPassword', () => {
		it('should return user with updated password', async () => {
			userRepositoryMock.updateUserPassword.mockResolvedValue(updatedUser);
			await expect(
				userService.setPassword(user.email, resetPassword.newPassword, resetPassword.newPassword)
			).resolves.toEqual(updatedUser);
		});

		it('should throw error when new password different from conf', async () => {
			await expect(
				userService.setPassword(user.email, resetPassword.newPassword, user.password)
			).rejects.toThrowError(PasswordsDontMatchException);
		});

		it('should throw error when new password different from conf', async () => {
			userRepositoryMock.updateUserPassword.mockResolvedValue(null);
			await expect(
				userService.setPassword(user.email, resetPassword.newPassword, resetPassword.newPassword)
			).rejects.toThrowError(BadRequestException);
		});
	});

	describe('checkEmailOfToken', () => {
		it('should return email of token', async () => {
			validateAuthServiceMock.getUserByToken.mockResolvedValue(resetPassword);
			userRepositoryMock.findOneByField.mockResolvedValue(user);
			await expect(userService.checkEmailOfToken(resetPassword.token)).resolves.toEqual(user.email);
		});

		it('should throw error when no user with given token', async () => {
			validateAuthServiceMock.getUserByToken.mockResolvedValue(null);
			await expect(userService.checkEmailOfToken(resetPassword.token)).rejects.toThrowError(
				UserNotFoundException
			);
		});

		it('should throw error when user is not found', async () => {
			validateAuthServiceMock.getUserByToken.mockResolvedValue(resetPassword);
			userRepositoryMock.findOneByField.mockResolvedValue(null);
			await expect(userService.checkEmailOfToken(resetPassword.token)).rejects.toThrowError(
				UserNotFoundException
			);
		});

		it('should throw error when token is not valid', async () => {
			resetPassword.updatedAt = faker.date.past({ years: 2 });
			validateAuthServiceMock.getUserByToken.mockResolvedValue(resetPassword);
			await expect(userService.checkEmailOfToken(resetPassword.token)).rejects.toThrowError(
				HttpException
			);
		});
	});

	describe('updateUserAvatar', () => {
		it('should return updated user', async () => {
			userRepositoryMock.updateUserAvatar.mockResolvedValue(user);
			await expect(userService.updateUserAvatar(user._id, url)).resolves.toEqual(user);
		});

		it('should throw error when user was not updated', async () => {
			userRepositoryMock.updateUserAvatar.mockResolvedValue(null);
			await expect(userService.updateUserAvatar(user._id, url)).rejects.toThrowError(
				UpdateFailedException
			);
		});
	});
});

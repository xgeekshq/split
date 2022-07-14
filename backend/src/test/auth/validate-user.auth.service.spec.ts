import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import configService from 'libs/test-utils/mocks/configService.mock';
import jwtService from 'libs/test-utils/mocks/jwtService.mock';
import mockedUser from 'libs/test-utils/mocks/user.mock';
import ValidateUserAuthServiceImpl from 'modules/auth/services/validate-user.auth.service';
import { GetUserService } from 'modules/users/interfaces/services/get.user.service.interface';
import { TYPES } from 'modules/users/interfaces/types';
import { getUserService } from 'modules/users/users.providers';

jest.mock('bcrypt');

describe('The AuthenticationService', () => {
	let authenticationService: ValidateUserAuthServiceImpl;
	let gUserService: GetUserService;
	let bcryptCompare: jest.Mock;
	let findUser: jest.Mock;
	beforeEach(async () => {
		findUser = jest.fn().mockImplementation(() => ({
			lean: jest.fn().mockImplementation(() => ({
				exec: jest.fn().mockReturnValue(mockedUser)
			}))
		}));
		const usersRepository = {
			findOne: findUser
		};

		bcryptCompare = jest.fn().mockReturnValue(true);
		(bcrypt.compare as jest.Mock) = bcryptCompare;

		const module = await Test.createTestingModule({
			providers: [
				ValidateUserAuthServiceImpl,
				getUserService,
				{
					provide: ConfigService,
					useValue: configService
				},
				{
					provide: JwtService,
					useValue: jwtService
				},
				{
					provide: getModelToken('User'),
					useValue: usersRepository
				}
			]
		}).compile();
		authenticationService = await module.get(ValidateUserAuthServiceImpl);
		gUserService = await module.get(TYPES.services.GetUserService);
	});
	describe('when accessing the data of authenticating user', () => {
		it('should attempt to get a user by email', async () => {
			const getByEmailSpy = jest.spyOn(gUserService, 'getByEmail');
			await authenticationService.validateUserWithCredentials(
				'user@email.com',
				'strongPassword'
			);
			expect(getByEmailSpy).toBeCalledTimes(1);
		});
		describe('and the provided password is not valid', () => {
			beforeEach(() => {
				bcryptCompare.mockReturnValue(false);
			});
			it('should throw an error', async () => {
				expect(
					await authenticationService.validateUserWithCredentials(
						'user@email.com',
						'strongPassword'
					)
				).toEqual(null);
			});
		});
		describe('and the provided password is valid', () => {
			beforeEach(() => {
				bcryptCompare.mockReturnValue(true);
			});
			describe('and the user is found in the database', () => {
				it('should return the user data', async () => {
					const user = await authenticationService.validateUserWithCredentials(
						'user@email.com',
						'strongPassword'
					);
					expect(user).toBe(mockedUser);
				});
			});
			describe('and the user is not found in the database', () => {
				beforeEach(() => {
					findUser.mockImplementation(() => ({
						lean: jest.fn().mockImplementation(() => ({
							exec: jest.fn().mockReturnValue(undefined)
						}))
					}));
				});
				it('should throw an error', async () => {
					await expect(
						authenticationService.validateUserWithCredentials(
							'user@email.com',
							'strongPassword'
						)
					).resolves.toEqual(null);
				});
			});
		});
	});
});

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import jwtService from 'src/libs/test-utils/mocks/jwtService.mock';
import { updateUserService, userRepository } from 'src/modules/users/users.providers';
import { getTokenAuthService, resetPasswordRepository } from '../auth.providers';
import { GetTokenAuthServiceInterface } from '../interfaces/services/get-token.auth.service.interface';
import { TYPES } from '../interfaces/types';

describe('AuthService', () => {
	let service: GetTokenAuthServiceInterface;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getTokenAuthService,
				updateUserService,
				userRepository,
				resetPasswordRepository,
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
					useValue: {}
				},
				{
					provide: getModelToken('ResetPassword'),
					useValue: {}
				}
			]
		}).compile();

		service = module.get<GetTokenAuthServiceInterface>(TYPES.services.GetTokenAuthService);
	});

	describe('when creating a jwt', () => {
		it('should return a object', () => {
			const userId = '1';
			expect(typeof service.getAccessToken(userId)).toEqual('object');
		});
	});
});

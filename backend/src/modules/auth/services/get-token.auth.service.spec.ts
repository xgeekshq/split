import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import jwtService from 'src/libs/test-utils/mocks/jwtService.mock';
import GetTokenAuthService from 'src/modules/auth/services/get-token.auth.service';
import { updateUserService, userRepository } from 'src/modules/users/users.providers';

describe('AuthService', () => {
	let service: GetTokenAuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetTokenAuthService,
				updateUserService,
				userRepository,
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

		service = module.get<GetTokenAuthService>(GetTokenAuthService);
	});

	describe('when creating a jwt', () => {
		it('should return a object', () => {
			const userId = '1';
			expect(typeof service.getAccessToken(userId)).toEqual('object');
		});
	});
});

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import jwtService from 'src/libs/test-utils/mocks/jwtService.mock';
import { GetTokenAuthServiceInterface } from '../interfaces/services/get-token.auth.service.interface';
import { UPDATE_USER_SERVICE } from 'src/modules/auth/constants';
import GetTokenAuthService from 'src/modules/auth/services/get-token.auth.service';
import { createMock } from '@golevelup/ts-jest';
import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';

describe('AuthService', () => {
	let service: GetTokenAuthServiceInterface;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetTokenAuthService,
				{
					provide: ConfigService,
					useValue: configService
				},
				{
					provide: JwtService,
					useValue: jwtService
				},
				{
					provide: UPDATE_USER_SERVICE,
					useValue: createMock<UpdateUserServiceInterface>
				}
			]
		}).compile();

		service = module.get<GetTokenAuthServiceInterface>(GetTokenAuthService);
	});

	describe('when creating a jwt', () => {
		it('should return a object', () => {
			const userId = '1';
			expect(typeof service.getAccessToken(userId)).toEqual('object');
		});
	});
});

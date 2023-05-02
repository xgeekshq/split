import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import AzureController from './azure.controller';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import { RegisterAuthServiceInterface } from 'src/modules/auth/interfaces/services/register.auth.service.interface';
import { CheckUserAzureUseCaseInterface } from '../interfaces/applications/check-user.azure.use-case.interface';
import { GET_USER_SERVICE } from 'src/modules/users/constants';
import { CHECK_USER_USE_CASE, REGISTER_OR_LOGIN_USE_CASE } from 'src/modules/azure/constants';

describe('AzureController', () => {
	let controller: AzureController;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			controllers: [AzureController],
			providers: [
				{
					provide: REGISTER_OR_LOGIN_USE_CASE,
					useValue: createMock<RegisterAuthServiceInterface>()
				},
				{
					provide: CHECK_USER_USE_CASE,
					useValue: createMock<CheckUserAzureUseCaseInterface>()
				},
				{
					provide: GET_USER_SERVICE,
					useValue: createMock<GetUserServiceInterface>()
				}
			]
		}).compile();
		controller = module.get<AzureController>(AzureController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

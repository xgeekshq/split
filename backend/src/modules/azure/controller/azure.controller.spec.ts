import * as Azure from 'src/modules/azure/interfaces/types';
import * as User from 'src/modules/users/interfaces/types';
import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import AzureController from './azure.controller';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import { RegisterAuthServiceInterface } from 'src/modules/auth/interfaces/services/register.auth.service.interface';
import { CheckUserAzureUseCaseInterface } from '../interfaces/applications/check-user.azure.use-case.interface';

describe('AzureController', () => {
	let controller: AzureController;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			controllers: [AzureController],
			providers: [
				{
					provide: Azure.TYPES.applications.RegisterOrLoginUseCase,
					useValue: createMock<RegisterAuthServiceInterface>()
				},
				{
					provide: Azure.TYPES.applications.CheckUserUseCase,
					useValue: createMock<CheckUserAzureUseCaseInterface>()
				},
				{
					provide: User.TYPES.services.GetUserService,
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

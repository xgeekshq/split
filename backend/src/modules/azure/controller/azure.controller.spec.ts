import * as Azure from 'src/modules/azure/interfaces/types';
import * as User from 'src/modules/users/interfaces/types';
import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import AzureController from './azure.controller';
import { AuthAzureApplication } from '../applications/auth.azure.application';
import { GetUserApplication } from 'src/modules/users/applications/get.user.application';

describe('AzureController', () => {
	let controller: AzureController;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			controllers: [AzureController],
			providers: [
				{
					provide: Azure.TYPES.applications.AuthAzureApplication,
					useValue: createMock<AuthAzureApplication>()
				},
				{
					provide: User.TYPES.applications.GetUserApplication,
					useValue: createMock<GetUserApplication>()
				}
			]
		}).compile();
		controller = module.get<AzureController>(AzureController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

import { createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { getUserUseCase } from '../users.providers';
import * as Users from 'src/modules/users/interfaces/types';
import { Test, TestingModule } from '@nestjs/testing';
import { GetUserServiceInterface } from '../interfaces/services/get.user.service.interface';
import User from '../entities/user.schema';

describe('GetUserUseCase', () => {
	let getUser: UseCase<string, User>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getUserUseCase,
				{
					provide: Users.TYPES.services.GetUserService,
					useValue: createMock<GetUserServiceInterface>()
				}
			]
		}).compile();

		getUser = module.get<UseCase<string, User>>(getUserUseCase.provide);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(getUser).toBeDefined();
	});
});

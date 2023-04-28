import { createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { getUserUseCase } from '../users.providers';
import { Test, TestingModule } from '@nestjs/testing';
import { GetUserServiceInterface } from '../interfaces/services/get.user.service.interface';
import User from '../entities/user.schema';
import { GET_USER_USE_CASE } from 'src/modules/users/constants';

describe('GetUserUseCase', () => {
	let getUser: UseCase<string, User>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getUserUseCase,
				{
					provide: GET_USER_USE_CASE,
					useValue: createMock<GetUserServiceInterface>()
				}
			]
		}).compile();

		getUser = module.get(getUserUseCase.provide);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(getUser).toBeDefined();
	});
});

import { createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { getAllUsersUseCase } from '../users.providers';
import * as Users from 'src/modules/users/constants';
import { Test, TestingModule } from '@nestjs/testing';
import User from '../entities/user.schema';

describe('GetAllUsersUseCase', () => {
	let getAllUsers: UseCase<void, User[]>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getAllUsersUseCase,
				{
					provide: Users.TYPES.repository,
					useValue: createMock<UserRepositoryInterface>()
				}
			]
		}).compile();

		getAllUsers = module.get<UseCase<void, User[]>>(getAllUsersUseCase.provide);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(getAllUsers).toBeDefined();
	});
});

import { createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { Test, TestingModule } from '@nestjs/testing';
import User from '../entities/user.schema';
import { USER_REPOSITORY } from 'src/modules/users/constants';
import GetAllUsersIncludeDeletedUseCase from './get-all-users-include-deleted.use-case';

describe('GetAllUsersIncludeDeletedUseCase', () => {
	let getAllUsers: UseCase<void, User[]>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetAllUsersIncludeDeletedUseCase,
				{
					provide: USER_REPOSITORY,
					useValue: createMock<UserRepositoryInterface>()
				}
			]
		}).compile();

		getAllUsers = module.get(GetAllUsersIncludeDeletedUseCase);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(getAllUsers).toBeDefined();
	});
});

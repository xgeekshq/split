import { createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { Test, TestingModule } from '@nestjs/testing';
import User from '../entities/user.schema';
import { USER_REPOSITORY } from 'src/modules/users/constants';
import GetAllUsersUseCase from 'src/modules/users/applications/get-all-users.use-case';

describe('GetAllUsersUseCase', () => {
	let getAllUsers: UseCase<void, User[]>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetAllUsersUseCase,
				{
					provide: USER_REPOSITORY,
					useValue: createMock<UserRepositoryInterface>()
				}
			]
		}).compile();

		getAllUsers = module.get(GetAllUsersUseCase);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(getAllUsers).toBeDefined();
	});
});

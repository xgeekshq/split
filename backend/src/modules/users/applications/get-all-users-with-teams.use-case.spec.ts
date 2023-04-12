import { createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { getAllUsersWithTeamsUseCase } from '../users.providers';
import * as Users from 'src/modules/users/interfaces/types';
import { Test, TestingModule } from '@nestjs/testing';

describe('GetAllUsersWithTeamsUseCase', () => {
	let deleteUser: UseCase<string, boolean>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getAllUsersWithTeamsUseCase,
				{
					provide: Users.TYPES.repository,
					useValue: createMock<UserRepositoryInterface>()
				}
			]
		}).compile();

		deleteUser = module.get<UseCase<string, boolean>>(getAllUsersWithTeamsUseCase.provide);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(deleteUser).toBeDefined();
	});
});

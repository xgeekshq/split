import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { deleteUserUseCase } from '../users.providers';
import * as Users from 'src/modules/users/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/delete.team.user.service.interface';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import faker from '@faker-js/faker';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import { DELETE_TEAM_USER_SERVICE, GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';

const userId = faker.datatype.uuid();
const userDeleted = UserFactory.create({ _id: userId });
const teamsOfUser = faker.datatype.number();

describe('DeleteUserUseCase', () => {
	let deleteUser: UseCase<string, boolean>;
	let userRepositoryMock: DeepMocked<UserRepositoryInterface>;
	let deleteTeamUserServiceMock: DeepMocked<DeleteTeamUserServiceInterface>;
	let getTeamUserServiceMock: DeepMocked<GetTeamUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				deleteUserUseCase,
				{
					provide: Users.TYPES.repository,
					useValue: createMock<UserRepositoryInterface>()
				},
				{
					provide: DELETE_TEAM_USER_SERVICE,
					useValue: createMock<DeleteTeamUserServiceInterface>()
				},
				{
					provide: GET_TEAM_USER_SERVICE,
					useValue: createMock<GetTeamUserServiceInterface>()
				}
			]
		}).compile();

		deleteUser = module.get<UseCase<string, boolean>>(deleteUserUseCase.provide);

		userRepositoryMock = module.get(Users.TYPES.repository);
		deleteTeamUserServiceMock = module.get(DELETE_TEAM_USER_SERVICE);
		getTeamUserServiceMock = module.get(GET_TEAM_USER_SERVICE);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(deleteUser).toBeDefined();
	});

	describe('execute', () => {
		it('should return true', async () => {
			userRepositoryMock.deleteUser.mockResolvedValue(userDeleted);
			getTeamUserServiceMock.countTeamsOfUser.mockResolvedValue(teamsOfUser);
			deleteTeamUserServiceMock.deleteTeamUsersOfUser.mockResolvedValue(teamsOfUser);
			await expect(deleteUser.execute(userId)).resolves.toEqual(true);
		});

		it('should throw error when user is not deleted', async () => {
			await expect(deleteUser.execute(userId)).rejects.toThrowError(DeleteFailedException);
		});

		it('should throw error when commitTransaction fails', async () => {
			userRepositoryMock.deleteUser.mockResolvedValue(userDeleted);
			getTeamUserServiceMock.countTeamsOfUser.mockResolvedValue(teamsOfUser);
			deleteTeamUserServiceMock.deleteTeamUsersOfUser.mockResolvedValue(teamsOfUser);
			userRepositoryMock.commitTransaction.mockRejectedValue(new Error());
			await expect(deleteUser.execute(userId)).rejects.toThrowError(DeleteFailedException);
		});
	});
});

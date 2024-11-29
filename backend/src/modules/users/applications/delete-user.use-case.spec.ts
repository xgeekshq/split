import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/delete.team.user.service.interface';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { faker } from '@faker-js/faker';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import { DELETE_TEAM_USER_SERVICE, GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';
import { USER_REPOSITORY } from 'src/modules/users/constants';
import { DeleteUserUseCase } from 'src/modules/users/applications/delete-user.use-case';
import { DELETE_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/delete.board.user.service.interface';

const userId = faker.string.uuid();
const userDeleted = UserFactory.create({ _id: userId });
const teamsOfUser = faker.number.int();

describe('DeleteUserUseCase', () => {
	let deleteUser: UseCase<string, boolean>;
	let userRepositoryMock: DeepMocked<UserRepositoryInterface>;
	let deleteTeamUserServiceMock: DeepMocked<DeleteTeamUserServiceInterface>;
	let getTeamUserServiceMock: DeepMocked<GetTeamUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeleteUserUseCase,
				{
					provide: USER_REPOSITORY,
					useValue: createMock<UserRepositoryInterface>()
				},
				{
					provide: DELETE_TEAM_USER_SERVICE,
					useValue: createMock<DeleteTeamUserServiceInterface>()
				},
				{
					provide: GET_TEAM_USER_SERVICE,
					useValue: createMock<GetTeamUserServiceInterface>()
				},
				{
					provide: DELETE_BOARD_USER_SERVICE,
					useValue: createMock<DeleteBoardUserServiceInterface>()
				}
			]
		}).compile();

		deleteUser = module.get(DeleteUserUseCase);

		userRepositoryMock = module.get(USER_REPOSITORY);
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

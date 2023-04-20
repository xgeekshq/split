import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { getAllUsersWithTeamsUseCase } from '../users.providers';
import * as Users from 'src/modules/users/interfaces/types';
import { Test, TestingModule } from '@nestjs/testing';
import { GetUserServiceInterface } from '../interfaces/services/get.user.service.interface';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import { UserWithTeams } from '../interfaces/type-user-with-teams';
import GetAllUsersWithTeamsUseCaseDto from '../dto/useCase/get-all-users-with-teams.use-case.dto';
import { GetAllUsersWithTeamsPresenter } from 'src/modules/users/presenter/get-all-users-with-teams.presenter';
import { sortTeamUserListAlphabetically } from '../utils/sortings';
import { GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';

const users = UserFactory.createMany(10);
const teams = TeamFactory.createMany(5);

const usersWithTeams: UserWithTeams[] = users.map((user) => ({
	user,
	teams: [...teams.map((team) => team._id)]
}));

const getAllUsersWithTeamsProps: GetAllUsersWithTeamsUseCaseDto = {};

const getAllUsersWithTeamsResult: GetAllUsersWithTeamsPresenter = {
	userWithTeams: sortTeamUserListAlphabetically(usersWithTeams),
	userAmount: users.length,
	hasNextPage: 0 + 1 < Math.ceil(users.length / 15),
	page: 0
};

describe('GetAllUsersWithTeamsUseCase', () => {
	let getAllUsersWithTeams: UseCase<GetAllUsersWithTeamsUseCaseDto, GetAllUsersWithTeamsPresenter>;
	let userRepositoryMock: DeepMocked<UserRepositoryInterface>;
	let getUserServiceMock: DeepMocked<GetUserServiceInterface>;
	let getTeamUserServiceMock: DeepMocked<GetTeamUserServiceInterface>;
	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getAllUsersWithTeamsUseCase,
				{
					provide: Users.TYPES.repository,
					useValue: createMock<UserRepositoryInterface>()
				},
				{
					provide: Users.TYPES.services.GetUserService,
					useValue: createMock<GetUserServiceInterface>()
				},
				{
					provide: GET_TEAM_USER_SERVICE,
					useValue: createMock<GetTeamUserServiceInterface>()
				}
			]
		}).compile();

		getAllUsersWithTeams = module.get<
			UseCase<GetAllUsersWithTeamsUseCaseDto, GetAllUsersWithTeamsPresenter>
		>(getAllUsersWithTeamsUseCase.provide);

		userRepositoryMock = module.get(Users.TYPES.repository);
		getUserServiceMock = module.get(Users.TYPES.services.GetUserService);
		getTeamUserServiceMock = module.get(GET_TEAM_USER_SERVICE);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(getAllUsersWithTeams).toBeDefined();
	});

	describe('execute', () => {
		it('should return paginated users with teams', async () => {
			userRepositoryMock.getAllWithPagination.mockResolvedValue(users);
			getUserServiceMock.countUsers.mockResolvedValue(users.length);
			getTeamUserServiceMock.getUsersOnlyWithTeams.mockResolvedValue(usersWithTeams);

			await expect(getAllUsersWithTeams.execute(getAllUsersWithTeamsProps)).resolves.toEqual(
				getAllUsersWithTeamsResult
			);
		});
	});
});

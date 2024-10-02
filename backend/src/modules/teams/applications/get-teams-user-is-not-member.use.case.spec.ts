import Team from 'src/modules/teams/entities/team.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { TEAM_REPOSITORY } from 'src/modules/teams/constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { faker } from '@faker-js/faker';
import { teamUsers, teamsWithUsers } from './get-team-mocked-results';
import { GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';
import { GetTeamsUserIsNotMemberUseCase } from './get-teams-user-is-not-member.use-case';

describe('GetTeamsUserIsNotMemberUseCase', () => {
	let getTeamsUserIsNotMember: UseCase<string, Team[]>;
	let teamRepositoryMock: DeepMocked<TeamRepositoryInterface>;
	let getTeamUserServiceMock: DeepMocked<GetTeamUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetTeamsUserIsNotMemberUseCase,
				{
					provide: TEAM_REPOSITORY,
					useValue: createMock<TeamRepositoryInterface>()
				},
				{
					provide: GET_TEAM_USER_SERVICE,
					useValue: createMock<GetTeamUserServiceInterface>()
				}
			]
		}).compile();

		getTeamsUserIsNotMember = module.get(GetTeamsUserIsNotMemberUseCase);
		teamRepositoryMock = module.get(TEAM_REPOSITORY);
		getTeamUserServiceMock = module.get(GET_TEAM_USER_SERVICE);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();

		teamRepositoryMock.getAllTeams.mockResolvedValue(teamsWithUsers);
		getTeamUserServiceMock.getAllTeamsOfUser.mockResolvedValue(teamUsers);
	});

	it('should be defined', () => {
		expect(getTeamsUserIsNotMember).toBeDefined();
	});

	describe('execute', () => {
		it('should return an array of objects with team.name and team._id where user is not team member', async () => {
			getTeamUserServiceMock.getAllTeamsOfUser.mockResolvedValue([]);

			const userId = faker.string.uuid();

			const expectedResult = teamsWithUsers.map(({ _id, name }) => ({
				_id,
				name
			}));
			const result = await getTeamsUserIsNotMember.execute(userId);

			expect(result).toEqual(expectedResult);
			expect(teamRepositoryMock.getAllTeams).toHaveBeenCalled();
			expect(getTeamUserServiceMock.getAllTeamsOfUser).toHaveBeenCalled();
		});
	});
});

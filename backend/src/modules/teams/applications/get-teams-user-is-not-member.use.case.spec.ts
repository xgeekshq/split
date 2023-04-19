import Team from 'src/modules/teams/entities/team.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { getTeamsUserIsNotMemberUseCase } from 'src/modules/teams/providers';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { TEAM_REPOSITORY } from 'src/modules/teams/constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import faker from '@faker-js/faker';
import { teamUsers, teamsWithUsers } from './get-team-mocked-results';

describe('GetTeamsUserIsNotMemberUseCase', () => {
	let getTeamsUserIsNotMember: UseCase<string, Team[]>;
	let teamRepositoryMock: DeepMocked<TeamRepositoryInterface>;
	let getTeamUserServiceMock: DeepMocked<GetTeamUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getTeamsUserIsNotMemberUseCase,
				{
					provide: TEAM_REPOSITORY,
					useValue: createMock<TeamRepositoryInterface>()
				},
				{
					provide: TeamUsers.TYPES.services.GetTeamUserService,
					useValue: createMock<GetTeamUserServiceInterface>()
				}
			]
		}).compile();

		getTeamsUserIsNotMember = module.get<UseCase<string, Team[]>>(
			getTeamsUserIsNotMemberUseCase.provide
		);
		teamRepositoryMock = module.get(TEAM_REPOSITORY);
		getTeamUserServiceMock = module.get(TeamUsers.TYPES.services.GetTeamUserService);
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

			const userId = faker.datatype.uuid();

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

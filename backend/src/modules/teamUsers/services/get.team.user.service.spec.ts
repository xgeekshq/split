import { getTeamUserService } from 'src/modules/teamUsers/teamusers.providers';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { TeamUserRepositoryInterface } from 'src/modules/teamUsers/interfaces/repositories/team-user.repository.interface';
import { TEAM_USER_REPOSITORY } from 'src/modules/teamUsers/constants';

describe('GetTeamUserService', () => {
	let teamUserService: GetTeamUserServiceInterface;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getTeamUserService,
				{
					provide: TEAM_USER_REPOSITORY,
					useValue: createMock<TeamUserRepositoryInterface>()
				}
			]
		}).compile();

		teamUserService = module.get<GetTeamUserServiceInterface>(getTeamUserService.provide);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(teamUserService).toBeDefined();
	});
});

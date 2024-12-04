import Team from 'src/modules/teams/entities/team.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { GET_TEAM_SERVICE } from 'src/modules/teams/constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';
import { GetTeamByNameUseCase } from './get-team-by-name.use-case';
import { teams } from './get-team-mocked-results';

describe('GetTeamByNameUseCase', () => {
	let getTeamByName: UseCase<string, Team>;
	let getTeamService: DeepMocked<GetTeamServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetTeamByNameUseCase,
				{
					provide: GET_TEAM_SERVICE,
					useValue: createMock<GetTeamServiceInterface>()
				}
			]
		}).compile();

		getTeamByName = module.get(GetTeamByNameUseCase);
		getTeamService = module.get(GET_TEAM_SERVICE);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();

		getTeamService.getTeamByName.mockResolvedValue(teams[0]);
	});

	it('should be defined', () => {
		expect(getTeamByName).toBeDefined();
	});
	describe('execute', () => {
		it('should return a team', async () => {
			const result = await getTeamByName.execute(teams[0].name);
			expect(result).toBe(teams[0]);
		});
	});
});

import Team from 'src/modules/teams/entities/team.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { getTeamUseCase } from 'src/modules/teams/providers';
import { GET_TEAM_SERVICE } from 'src/modules/teams/constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';

describe('GetTeamUseCase', () => {
	let getTeam: UseCase<string, Team>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getTeamUseCase,
				{
					provide: GET_TEAM_SERVICE,
					useValue: createMock<GetTeamServiceInterface>()
				}
			]
		}).compile();

		getTeam = module.get<UseCase<string, Team>>(getTeamUseCase.provide);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(getTeam).toBeDefined();
	});
});

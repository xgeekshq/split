import Team from 'src/modules/teams/entities/team.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { getTeamsOfUserUseCase } from 'src/modules/teams/providers';
import { GET_TEAM_SERVICE } from 'src/modules/teams/constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';

describe('GetTeamsOfUserUseCase', () => {
	let getTeamsOfUser: UseCase<string, Team[]>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getTeamsOfUserUseCase,
				{
					provide: GET_TEAM_SERVICE,
					useValue: createMock<GetTeamServiceInterface>()
				}
			]
		}).compile();

		getTeamsOfUser = module.get<UseCase<string, Team[]>>(getTeamsOfUserUseCase.provide);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(getTeamsOfUser).toBeDefined();
	});
});

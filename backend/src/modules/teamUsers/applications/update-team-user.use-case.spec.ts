import { UpdateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/update.team.user.service.interface';
import { updateTeamUserUseCase } from '../teamusers.providers';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import TeamUserDto from '../dto/team.user.dto';
import TeamUser from '../entities/team.user.schema';
import { UPDATE_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';

describe('UpdateTeamUserUseCase', () => {
	let updateTeamUser: UseCase<TeamUserDto, TeamUser>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				updateTeamUserUseCase,
				{
					provide: UPDATE_TEAM_USER_SERVICE,
					useValue: createMock<UpdateTeamUserServiceInterface>()
				}
			]
		}).compile();

		updateTeamUser = module.get(updateTeamUserUseCase.provide);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(updateTeamUser).toBeDefined();
	});
});

import { CreateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/create.team.user.service.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import TeamUserDto from '../dto/team.user.dto';
import TeamUser from '../entities/team.user.schema';
import { CREATE_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';
import { CreateTeamUsersUseCase } from 'src/modules/teamUsers/applications/create-team-users.use-case';

describe('CreateTeamUsersUseCase', () => {
	let createTeamUsers: UseCase<TeamUserDto[], TeamUser[]>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateTeamUsersUseCase,
				{
					provide: CREATE_TEAM_USER_SERVICE,
					useValue: createMock<CreateTeamUserServiceInterface>()
				}
			]
		}).compile();

		createTeamUsers = module.get(CreateTeamUsersUseCase);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(createTeamUsers).toBeDefined();
	});
});

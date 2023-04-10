import { UpdateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/update.team.user.service.interface';
import { updateTeamUserUseCase } from '../teamusers.providers';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import TeamUserDto from '../dto/team.user.dto';
import TeamUser from '../entities/team.user.schema';

describe('UpdateTeamUserUseCase', () => {
	let updateTeamUser: UseCase<TeamUserDto, TeamUser>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				updateTeamUserUseCase,
				{
					provide: TeamUsers.TYPES.services.UpdateTeamUserService,
					useValue: createMock<UpdateTeamUserServiceInterface>()
				}
			]
		}).compile();

		updateTeamUser = module.get<UseCase<TeamUserDto, TeamUser>>(updateTeamUserUseCase.provide);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(updateTeamUser).toBeDefined();
	});
});

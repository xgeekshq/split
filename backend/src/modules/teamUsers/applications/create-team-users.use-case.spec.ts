import { CreateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/create.team.user.service.interface';
import { createTeamUsersUseCase } from './../teamusers.providers';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import TeamUserDto from '../dto/team.user.dto';
import TeamUser from '../entities/team.user.schema';

describe('CreateTeamUsersUseCase', () => {
	let createTeamUsers: UseCase<TeamUserDto[], TeamUser[]>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				createTeamUsersUseCase,
				{
					provide: TeamUsers.TYPES.services.CreateTeamUserService,
					useValue: createMock<CreateTeamUserServiceInterface>()
				}
			]
		}).compile();

		createTeamUsers = module.get<UseCase<TeamUserDto[], TeamUser[]>>(
			createTeamUsersUseCase.provide
		);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(createTeamUsers).toBeDefined();
	});
});

import Team from 'src/modules/teams/entities/team.schema';
import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import { BoardUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardUserDto-factory.mock';
import { faker } from '@faker-js/faker';

import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import { teamUserRepository } from './../../teamusers/teamusers.providers';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CreateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/create.team.user.service.interface';
import { TeamRepositoryInterface } from './../../../../dist/modules/teams/repositories/team.repository.interface.d';
import { createTeamService } from 'src/modules/teams/providers';
import { CreateTeamServiceInterface } from '../interfaces/services/create.team.service.interface';
import * as Teams from 'src/modules/teams/interfaces/types';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import { CreateTeamDto } from '../dto/create-team.dto';
import { TeamUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/teamUserDto-factory.mock';

const team = TeamFactory.create();

describe('CreateTeamService', () => {
	let teamService: CreateTeamServiceInterface;
	let teamRepositoryMock: DeepMocked<TeamRepositoryInterface>;
	let createTeamUserServiceMock: DeepMocked<CreateTeamUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				createTeamService,
				{
					provide: Teams.TYPES.repositories.TeamRepository,
					useValue: createMock<TeamRepositoryInterface>()
				},
				{
					provide: TeamUsers.TYPES.services.CreateTeamUserService,
					useValue: createMock<CreateTeamUserServiceInterface>()
				}
			]
		}).compile();

		teamService = module.get<CreateTeamServiceInterface>(createTeamService.provide);
		teamRepositoryMock = module.get(Teams.TYPES.repositories.TeamRepository);
		createTeamUserServiceMock = module.get(TeamUsers.TYPES.services.CreateTeamUserService);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(teamService).toBeDefined();
	});

	describe('create', () => {
		it('should create team', () => {
			const createTeamDto: CreateTeamDto = {
				name: faker.name.findName(),
				users: TeamUserDtoFactory.createMany(4)
			};

			const createdTeam: Team = TeamFactory.create({
				name: createTeamDto.name
			});

			// teamRepositoryMock.findOneByField.mockResolvedValue(null);
			teamRepositoryMock.create.mockResolvedValue(createdTeam);
			createTeamUserServiceMock.createTeamUsers.mockResolvedValue(createTeamDto.users);
		});

		it('should throw conflict error', () => {});
	});
});

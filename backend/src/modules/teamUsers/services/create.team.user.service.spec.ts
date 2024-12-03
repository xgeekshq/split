import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { createTeamUserService } from 'src/modules/teamUsers/teamusers.providers';
import { TeamUserFactory } from 'src/libs/test-utils/mocks/factories/teamUser-factory.mock';
import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CreateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/create.team.user.service.interface';
import { TeamUserRepositoryInterface } from 'src/modules/teamUsers/interfaces/repositories/team-user.repository.interface';
import { TeamUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/teamUserDto-factory.mock';
import { TEAM_USER_REPOSITORY } from 'src/modules/teamUsers/constants';

const createTeamUserDtos: TeamUserDto[] = TeamUserDtoFactory.createMany(4);

const createdTeamUsers: TeamUser[] = TeamUserFactory.createMany(4, [
	{ ...createTeamUserDtos[0] },
	{ ...createTeamUserDtos[1] },
	{ ...createTeamUserDtos[2] },
	{ ...createTeamUserDtos[3] }
]);

const teamId = faker.string.uuid();

describe('CreateTeamUserService', () => {
	let teamUserService: CreateTeamUserServiceInterface;
	let teamUserRepositoryMock: DeepMocked<TeamUserRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				createTeamUserService,
				{
					provide: TEAM_USER_REPOSITORY,
					useValue: createMock<TeamUserRepositoryInterface>()
				}
			]
		}).compile();

		teamUserService = module.get(createTeamUserService.provide);
		teamUserRepositoryMock = module.get(TEAM_USER_REPOSITORY);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(teamUserService).toBeDefined();
	});

	describe('createTeamUsers', () => {
		it('should create team users', async () => {
			teamUserRepositoryMock.insertMany.mockResolvedValue(createdTeamUsers);
			await expect(teamUserService.createTeamUsers(createTeamUserDtos)).resolves.toStrictEqual(
				createdTeamUsers
			);
		});

		it('should create team users with a team', async () => {
			teamUserRepositoryMock.insertMany.mockResolvedValue(createdTeamUsers);
			await expect(
				teamUserService.createTeamUsers(createTeamUserDtos, teamId)
			).resolves.toStrictEqual(createdTeamUsers);
		});

		it('should throw Bad Request when team users are not created', async () => {
			teamUserRepositoryMock.insertMany.mockResolvedValue([createdTeamUsers[0]]);
			await expect(teamUserService.createTeamUsers(createTeamUserDtos)).rejects.toThrow(
				BadRequestException
			);
		});
	});
});

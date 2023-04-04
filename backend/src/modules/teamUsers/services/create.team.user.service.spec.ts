import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { createTeamUserService } from 'src/modules/teamUsers/teamusers.providers';
import { TeamUserFactory } from 'src/libs/test-utils/mocks/factories/teamUser-factory.mock';
import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CreateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/create.team.user.service.interface';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import { TeamUserRepositoryInterface } from 'src/modules/teamUsers/interfaces/repositories/team-user.repository.interface';
import { TeamUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/teamUserDto-factory.mock';

const createTeamUserDtos: TeamUserDto[] = TeamUserDtoFactory.createMany(4);

const createdTeamUsers: TeamUser[] = TeamUserFactory.createMany(4, [
	{ ...createTeamUserDtos[0] },
	{ ...createTeamUserDtos[1] },
	{ ...createTeamUserDtos[2] },
	{ ...createTeamUserDtos[3] }
]);

const teamId = faker.datatype.uuid();

describe('CreateTeamUserService', () => {
	let teamUserService: CreateTeamUserServiceInterface;
	let teamUserRepositoryMock: DeepMocked<TeamUserRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				createTeamUserService,
				{
					provide: TeamUsers.TYPES.repositories.TeamUserRepository,
					useValue: createMock<TeamUserRepositoryInterface>()
				}
			]
		}).compile();

		teamUserService = module.get<CreateTeamUserServiceInterface>(createTeamUserService.provide);
		teamUserRepositoryMock = module.get(TeamUsers.TYPES.repositories.TeamUserRepository);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(teamUserService).toBeDefined();
	});

	describe('createTeamUser', () => {
		it('should create team user', async () => {
			teamUserRepositoryMock.create.mockResolvedValue(createdTeamUsers[0]);
			await expect(teamUserService.createTeamUser(createTeamUserDtos[0])).resolves.toStrictEqual(
				createdTeamUsers[0]
			);
		});
		it('should throw Bad Request when team user is not created', async () => {
			teamUserRepositoryMock.create.mockResolvedValue(null);
			await expect(teamUserService.createTeamUser(createTeamUserDtos[0])).rejects.toThrow(
				BadRequestException
			);
		});
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

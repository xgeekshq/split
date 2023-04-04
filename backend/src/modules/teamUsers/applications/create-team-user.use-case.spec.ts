import { createTeamUserUseCase } from './../teamusers.providers';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import { TeamUserRepositoryInterface } from 'src/modules/teamUsers/interfaces/repositories/team-user.repository.interface';
import TeamUserDto from '../dto/team.user.dto';
import TeamUser from '../entities/team.user.schema';
import { BadRequestException } from '@nestjs/common';
import { TeamUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/teamUserDto-factory.mock';
import { TeamUserFactory } from 'src/libs/test-utils/mocks/factories/teamUser-factory.mock';

const createTeamUserDto: TeamUserDto = TeamUserDtoFactory.create();

const createdTeamUser: TeamUser = TeamUserFactory.create({ ...createTeamUserDto });

describe('DuplicateBoardUseCase', () => {
	let createTeamUser: UseCase<TeamUserDto, TeamUser>;
	let teamUserRepositoryMock: DeepMocked<TeamUserRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				createTeamUserUseCase,
				{
					provide: TeamUsers.TYPES.repositories.TeamUserRepository,
					useValue: createMock<TeamUserRepositoryInterface>()
				}
			]
		}).compile();

		createTeamUser = module.get<UseCase<TeamUserDto, TeamUser>>(createTeamUserUseCase.provide);

		teamUserRepositoryMock = module.get(TeamUsers.TYPES.repositories.TeamUserRepository);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(createTeamUser).toBeDefined();
	});
	describe('createTeamUser', () => {
		it('should create team user', async () => {
			teamUserRepositoryMock.create.mockResolvedValue(createdTeamUser);
			await expect(createTeamUser.execute(createTeamUserDto)).resolves.toStrictEqual(
				createdTeamUser
			);
		});
		it('should throw Bad Request when team user is not created', async () => {
			teamUserRepositoryMock.create.mockResolvedValue(null);
			await expect(createTeamUser.execute(createTeamUserDto)).rejects.toThrow(BadRequestException);
		});
	});
});

import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import Team from 'src/modules/teams/entities/team.schema';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CreateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/create.team.user.service.interface';
import { CreateTeamServiceInterface } from '../interfaces/services/create.team.service.interface';
import { CreateTeamDto } from '../dto/create-team.dto';
import { TeamUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/teamUserDto-factory.mock';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { TEAM_ALREADY_EXISTS } from 'src/libs/constants/team';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { TEAM_REPOSITORY } from 'src/modules/teams/constants';
import CreateTeamService from 'src/modules/teams/services/create.team.service';
import { CREATE_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';

const createTeamDto: CreateTeamDto = {
	name: faker.name.findName(),
	users: TeamUserDtoFactory.createMany(4)
};

const createdTeam: Team = TeamFactory.create({
	name: createTeamDto.name,
	users: createTeamDto.users
});

describe('CreateTeamService', () => {
	let teamService: CreateTeamServiceInterface;
	let teamRepositoryMock: DeepMocked<TeamRepositoryInterface>;
	let createTeamUserServiceMock: DeepMocked<CreateTeamUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateTeamService,
				{
					provide: TEAM_REPOSITORY,
					useValue: createMock<TeamRepositoryInterface>()
				},
				{
					provide: CREATE_TEAM_USER_SERVICE,
					useValue: createMock<CreateTeamUserServiceInterface>()
				}
			]
		}).compile();

		teamService = module.get(CreateTeamService);
		teamRepositoryMock = module.get(TEAM_REPOSITORY);
		createTeamUserServiceMock = module.get(CREATE_TEAM_USER_SERVICE);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();

		teamRepositoryMock.findOneByField.mockResolvedValue(null);
		teamRepositoryMock.create.mockResolvedValue(createdTeam);
		createTeamUserServiceMock.createTeamUsers.mockResolvedValue(createTeamDto.users);
	});

	it('should be defined', () => {
		expect(teamService).toBeDefined();
	});

	describe('create', () => {
		it('should create team', async () => {
			await expect(teamService.create(createTeamDto)).resolves.toStrictEqual(createdTeam);
		});

		it('should throw conflict error when team already created', async () => {
			teamRepositoryMock.findOneByField.mockResolvedValue(createdTeam);
			await expect(teamService.create(createTeamDto)).rejects.toThrow(
				new HttpException(TEAM_ALREADY_EXISTS, HttpStatus.CONFLICT)
			);
		});

		it('should throw bad request error when team is not created', async () => {
			teamRepositoryMock.create.mockResolvedValue(null);
			try {
				await teamService.create(createTeamDto);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
			}
		});

		it('should throw bad request error when teamusers are not created', async () => {
			createTeamUserServiceMock.createTeamUsers.mockResolvedValue([]);
			try {
				await teamService.create(createTeamDto);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
			}
		});

		it('should throw bad request error when commitTransaction fails on saving teamUsers', async () => {
			createTeamUserServiceMock.commitTransaction.mockRejectedValue(
				new Error('teamUserService commit error')
			);
			await expect(teamService.create(createTeamDto)).rejects.toThrow(BadRequestException);
		});

		it('should throw bad request error when commitTransaction fails on saving team', async () => {
			teamRepositoryMock.commitTransaction.mockRejectedValue(
				new Error('teamRepository commit error')
			);
			await expect(teamService.create(createTeamDto)).rejects.toThrow(BadRequestException);
		});
	});
});

import { CreateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/create.team.user.service.interface';
import { DeleteTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/delete.team.user.service.interface';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { updateTeamUserService } from './../teamusers.providers';
import { TeamUserFactory } from 'src/libs/test-utils/mocks/factories/teamUser-factory.mock';
import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UpdateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/update.team.user.service.interface';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { TeamUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/teamUserDto-factory.mock';

const createTeamUserDtos: TeamUserDto[] = TeamUserDtoFactory.createMany(4);

const createdTeamUsers: TeamUser[] = TeamUserFactory.createMany(4, [
	{ ...createTeamUserDtos[0] },
	{ ...createTeamUserDtos[1] },
	{ ...createTeamUserDtos[2] },
	{ ...createTeamUserDtos[3] }
]);

const removeTeamUsers: string[] = [
	faker.datatype.uuid(),
	faker.datatype.uuid(),
	faker.datatype.uuid(),
	faker.datatype.uuid()
];

describe('UpdateTeamUserService', () => {
	let teamUserService: UpdateTeamUserServiceInterface;
	let createTeamUserServiceMock: DeepMocked<CreateTeamUserServiceInterface>;
	let deleteTeamUserServiceMock: DeepMocked<DeleteTeamUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				updateTeamUserService,
				{
					provide: TeamUsers.TYPES.repositories.TeamUserRepository,
					useValue: createMock<TeamUserRepositoryInterface>()
				},
				{
					provide: TeamUsers.TYPES.services.CreateTeamUserService,
					useValue: createMock<CreateTeamUserServiceInterface>()
				},
				{
					provide: TeamUsers.TYPES.services.DeleteTeamUserService,
					useValue: createMock<DeleteTeamUserServiceInterface>()
				}
			]
		}).compile();

		teamUserService = module.get<UpdateTeamUserServiceInterface>(updateTeamUserService.provide);
		createTeamUserServiceMock = module.get(TeamUsers.TYPES.services.CreateTeamUserService);
		deleteTeamUserServiceMock = module.get(TeamUsers.TYPES.services.DeleteTeamUserService);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();

		createTeamUserServiceMock.createTeamUsers.mockResolvedValue(createdTeamUsers);
		deleteTeamUserServiceMock.deleteTeamUsers.mockResolvedValue(removeTeamUsers.length);
	});

	it('should be defined', () => {
		expect(teamUserService).toBeDefined();
	});

	describe('addAndRemoveTeamUsers', () => {
		it('should insert and delete team users, returns team users added', async () => {
			await expect(
				teamUserService.addAndRemoveTeamUsers(createTeamUserDtos, removeTeamUsers)
			).resolves.toStrictEqual(createdTeamUsers);
		});

		it('should throw Bad Request when team users are not created', async () => {
			createTeamUserServiceMock.createTeamUsers.mockRejectedValue(BadRequestException);

			await expect(
				async () => await teamUserService.addAndRemoveTeamUsers(createTeamUserDtos, removeTeamUsers)
			).rejects.toThrowError(BadRequestException);
			expect(createTeamUserServiceMock.abortTransaction).toBeCalled();
		});

		it('should throw Bad Request when team users were not deleted', async () => {
			deleteTeamUserServiceMock.deleteTeamUsers.mockRejectedValue(BadRequestException);

			await expect(
				async () => await teamUserService.addAndRemoveTeamUsers(createTeamUserDtos, removeTeamUsers)
			).rejects.toThrowError(BadRequestException);
			expect(createTeamUserServiceMock.abortTransaction).toBeCalled();
			expect(deleteTeamUserServiceMock.abortTransaction).toBeCalled();
		});
	});
});

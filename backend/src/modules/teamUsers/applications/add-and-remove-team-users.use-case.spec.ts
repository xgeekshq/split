import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import TeamUserDto from '../dto/team.user.dto';
import TeamUser from '../entities/team.user.schema';
import { BadRequestException } from '@nestjs/common';
import { TeamUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/teamUserDto-factory.mock';
import { TeamUserFactory } from 'src/libs/test-utils/mocks/factories/teamUser-factory.mock';
import UpdateTeamUserDto from '../dto/update.team.user.dto';
import { CreateTeamUserServiceInterface } from '../interfaces/services/create.team.user.service.interface';
import { DeleteTeamUserServiceInterface } from '../interfaces/services/delete.team.user.service.interface';
import faker from '@faker-js/faker';
import { AddAndRemoveTeamUsersUseCase } from 'src/modules/teamUsers/applications/add-and-remove-team-users.use-case';
import {
	CREATE_TEAM_USER_SERVICE,
	DELETE_TEAM_USER_SERVICE
} from 'src/modules/teamUsers/constants';

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
const updateTeamUsers: UpdateTeamUserDto = {
	addUsers: createTeamUserDtos,
	removeUsers: removeTeamUsers
};

const onlyRemoveTeamUsers: UpdateTeamUserDto = {
	addUsers: [],
	removeUsers: removeTeamUsers
};

describe('AddAndRemoveTeamUsersUseCase', () => {
	let addAndRemoveTeamUser: UseCase<UpdateTeamUserDto, TeamUser[]>;
	let createTeamUserServiceMock: DeepMocked<CreateTeamUserServiceInterface>;
	let deleteTeamUserServiceMock: DeepMocked<DeleteTeamUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AddAndRemoveTeamUsersUseCase,
				{
					provide: CREATE_TEAM_USER_SERVICE,
					useValue: createMock<CreateTeamUserServiceInterface>()
				},
				{
					provide: DELETE_TEAM_USER_SERVICE,
					useValue: createMock<DeleteTeamUserServiceInterface>()
				}
			]
		}).compile();

		addAndRemoveTeamUser = module.get(AddAndRemoveTeamUsersUseCase);

		createTeamUserServiceMock = module.get(CREATE_TEAM_USER_SERVICE);
		deleteTeamUserServiceMock = module.get(DELETE_TEAM_USER_SERVICE);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();

		createTeamUserServiceMock.createTeamUsers.mockResolvedValue(createdTeamUsers);
		deleteTeamUserServiceMock.deleteTeamUsers.mockResolvedValue(removeTeamUsers.length);
	});

	it('should be defined', () => {
		expect(addAndRemoveTeamUser).toBeDefined();
	});

	describe('addAndRemoveTeamUsers', () => {
		it('should insert and delete team users, returns team users added', async () => {
			await expect(addAndRemoveTeamUser.execute(updateTeamUsers)).resolves.toStrictEqual(
				createdTeamUsers
			);
		});

		it('should return empty list when there are only team users to delete', async () => {
			await expect(addAndRemoveTeamUser.execute(onlyRemoveTeamUsers)).resolves.toStrictEqual([]);
		});

		it('should throw Bad Request when team users are not created', async () => {
			createTeamUserServiceMock.createTeamUsers.mockRejectedValue(BadRequestException);

			await expect(
				async () => await addAndRemoveTeamUser.execute(updateTeamUsers)
			).rejects.toThrowError(BadRequestException);
			expect(createTeamUserServiceMock.abortTransaction).toBeCalled();
		});

		it('should throw Bad Request when team users were not deleted', async () => {
			deleteTeamUserServiceMock.deleteTeamUsers.mockRejectedValue(BadRequestException);

			await expect(
				async () => await addAndRemoveTeamUser.execute(updateTeamUsers)
			).rejects.toThrowError(BadRequestException);
			expect(createTeamUserServiceMock.abortTransaction).toBeCalled();
			expect(deleteTeamUserServiceMock.abortTransaction).toBeCalled();
		});
	});
});

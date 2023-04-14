import { TeamRoles } from 'src/libs/enum/team.roles';
import { CreateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/create.team.user.service.interface';
import { DeleteTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/delete.team.user.service.interface';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { updateTeamUserService } from './../teamusers.providers';
import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UpdateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/update.team.user.service.interface';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { TeamUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/teamUserDto-factory.mock';
import {
	CREATE_TEAM_USER_SERVICE,
	DELETE_TEAM_USER_SERVICE,
	TEAM_USER_REPOSITORY
} from 'src/modules/teamUsers/constants';

const teamUser: TeamUserDto = TeamUserDtoFactory.create();

const possibleRoles = [TeamRoles.ADMIN, TeamRoles.MEMBER, TeamRoles.STAKEHOLDER].filter(
	(role) => role !== teamUser.role
);
const updatedTeamUser: TeamUser = {
	...teamUser,
	role: faker.helpers.arrayElement(possibleRoles)
};

describe('UpdateTeamUserService', () => {
	let teamUserService: UpdateTeamUserServiceInterface;

	let teamUserRepositoryMock: DeepMocked<TeamUserRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				updateTeamUserService,
				{
					provide: TEAM_USER_REPOSITORY,
					useValue: createMock<TeamUserRepositoryInterface>()
				},
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

		teamUserService = module.get(updateTeamUserService.provide);
		teamUserRepositoryMock = module.get(TEAM_USER_REPOSITORY);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(teamUserService).toBeDefined();
	});

	describe('updateTeamUser', () => {
		it('should update team user', async () => {
			teamUserRepositoryMock.updateTeamUser.mockResolvedValue(updatedTeamUser);
			await expect(teamUserService.updateTeamUser(teamUser)).resolves.toEqual(updatedTeamUser);
		});

		it('should throw error when team user is not updated', async () => {
			teamUserRepositoryMock.updateTeamUser.mockResolvedValue(null);
			await expect(async () => teamUserService.updateTeamUser(teamUser)).rejects.toThrowError(
				BadRequestException
			);
		});
	});
});

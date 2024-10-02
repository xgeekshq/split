import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { deleteTeamUserService } from './../teamusers.providers';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { DeleteTeamUserServiceInterface } from '../interfaces/services/delete.team.user.service.interface';
import { TEAM_USER_REPOSITORY } from 'src/modules/teamUsers/constants';

const removeTeamUsers: string[] = [
	faker.string.uuid(),
	faker.string.uuid(),
	faker.string.uuid(),
	faker.string.uuid()
];

const deleteManyFailResult = { acknowledged: false, deletedCount: faker.number.int() };
const deleteManySuccessResult = { acknowledged: true, deletedCount: faker.number.int() };

const teamId = faker.string.uuid();
const userId = faker.string.uuid();

describe('DeleteTeamUserService', () => {
	let teamUserService: DeleteTeamUserServiceInterface;
	let teamUserRepositoryMock: DeepMocked<TeamUserRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				deleteTeamUserService,
				{
					provide: TEAM_USER_REPOSITORY,
					useValue: createMock<TeamUserRepositoryInterface>()
				}
			]
		}).compile();

		teamUserService = module.get(deleteTeamUserService.provide);
		teamUserRepositoryMock = module.get(TEAM_USER_REPOSITORY);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(teamUserService).toBeDefined();
	});

	describe('deleteTeamUsersOfUser', () => {
		it('should delete team users associated with user', async () => {
			teamUserRepositoryMock.deleteTeamUsersOfUser.mockResolvedValue(deleteManySuccessResult);
			await expect(teamUserService.deleteTeamUsersOfUser(userId, false)).resolves.toEqual(
				deleteManySuccessResult.deletedCount
			);
		});

		it('should throw error when team users are not deleted', async () => {
			teamUserRepositoryMock.deleteTeamUsersOfUser.mockResolvedValue(deleteManyFailResult);
			await expect(async () =>
				teamUserService.deleteTeamUsersOfUser(userId, false)
			).rejects.toThrowError(BadRequestException);
		});
	});

	describe('deleteTeamUsers', () => {
		it('should delete team users', async () => {
			teamUserRepositoryMock.deleteTeamUsers.mockResolvedValue(deleteManySuccessResult);
			await expect(teamUserService.deleteTeamUsers(removeTeamUsers, false)).resolves.toEqual(
				deleteManySuccessResult.deletedCount
			);
		});

		it('should throw error when team users are not deleted', async () => {
			teamUserRepositoryMock.deleteTeamUsers.mockResolvedValue(deleteManyFailResult);
			await expect(async () =>
				teamUserService.deleteTeamUsers(removeTeamUsers, false)
			).rejects.toThrowError(BadRequestException);
		});
	});

	describe('deleteTeamUsersOfTeam', () => {
		it('should delete team users associated with a team', async () => {
			teamUserRepositoryMock.deleteTeamUsersOfTeam.mockResolvedValue(deleteManySuccessResult);
			await expect(teamUserService.deleteTeamUsersOfTeam(teamId, false)).resolves.toEqual(
				deleteManySuccessResult.acknowledged
			);
		});

		it('should throw error when team users are not deleted', async () => {
			teamUserRepositoryMock.deleteTeamUsersOfTeam.mockResolvedValue(deleteManyFailResult);
			await expect(async () =>
				teamUserService.deleteTeamUsersOfTeam(teamId, false)
			).rejects.toThrowError(BadRequestException);
		});
	});
});

import { DeleteTeamServiceInterface } from './../interfaces/services/delete.team.service.interface';
import User from 'src/modules/users/entities/user.schema';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import Team from 'src/modules/teams/entities/team.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import * as Boards from 'src/modules/boards/types';
import { TeamUserFactory } from 'src/libs/test-utils/mocks/factories/teamUser-factory.mock';
import { DeleteBoardServiceInterface } from 'src/modules/boards/interfaces/services/delete.board.service.interface';
import { DeleteTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/delete.team.user.service.interface';
import { BadRequestException } from '@nestjs/common';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { TEAM_REPOSITORY } from 'src/modules/teams/constants';
import DeleteTeamService from 'src/modules/teams/services/delete.team.service';
import { DELETE_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';

const teams: Team[] = TeamFactory.createMany(4);
const teamUsers: TeamUser[] = TeamUserFactory.createMany(5);
const users: User[] = UserFactory.createMany(5);
const usersWithId = users.map((user, idx) => ({
	_id: teamUsers[idx]._id,
	...user
}));
const teamUsersWithUsers = teamUsers.map((teamUser, idx) => ({
	...teamUser,
	user: usersWithId[idx]
}));
const team1 = {
	...teams[0],
	users: teamUsersWithUsers
};

describe('DeleteTeamService', () => {
	let teamService: DeleteTeamServiceInterface;
	let teamRepositoryMock: DeepMocked<TeamRepositoryInterface>;
	let deleteBoardServiceMock: DeepMocked<DeleteBoardServiceInterface>;
	let deleteTeamUserServiceMock: DeepMocked<DeleteTeamUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeleteTeamService,
				{
					provide: TEAM_REPOSITORY,
					useValue: createMock<TeamRepositoryInterface>()
				},
				{
					provide: Boards.TYPES.services.DeleteBoardService,
					useValue: createMock<DeleteBoardServiceInterface>()
				},
				{
					provide: DELETE_TEAM_USER_SERVICE,
					useValue: createMock<DeleteTeamUserServiceInterface>()
				}
			]
		}).compile();

		teamService = module.get(DeleteTeamService);
		teamRepositoryMock = module.get(TEAM_REPOSITORY);
		deleteTeamUserServiceMock = module.get(DELETE_TEAM_USER_SERVICE);
		deleteBoardServiceMock = module.get(Boards.TYPES.services.DeleteBoardService);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();

		teamRepositoryMock.findOneAndRemoveByField.mockResolvedValue(team1);
		deleteTeamUserServiceMock.deleteTeamUsersOfTeam.mockResolvedValue(true);
		deleteBoardServiceMock.deleteBoardsByTeamId.mockResolvedValue(true);
	});

	it('should be defined', () => {
		expect(teamService).toBeDefined();
	});

	describe('delete', () => {
		it('should return true', async () => {
			await expect(teamService.delete(team1._id)).resolves.toEqual(true);
		});

		it('should throw BadRequest when team not deleted', async () => {
			teamRepositoryMock.findOneAndRemoveByField.mockResolvedValue(null);

			await expect(teamService.delete(team1._id)).rejects.toThrowError(BadRequestException);
		});

		it('should throw BadRequest when teamUsers not deleted', async () => {
			deleteTeamUserServiceMock.deleteTeamUsersOfTeam.mockRejectedValue(BadRequestException);

			await expect(teamService.delete(team1._id)).rejects.toThrowError(BadRequestException);
		});

		it('should throw BadRequest when boards not deleted', async () => {
			deleteBoardServiceMock.deleteBoardsByTeamId.mockRejectedValue(BadRequestException);

			await expect(teamService.delete(team1._id)).rejects.toThrowError(BadRequestException);
		});

		it('should throw BadRequest when teamRepository.commitTransaction fails', async () => {
			teamRepositoryMock.commitTransaction.mockRejectedValue(Error);

			await expect(teamService.delete(team1._id)).rejects.toThrowError(BadRequestException);
		});

		it('should throw BadRequest when deleteTeamUserService.commitTransaction fails', async () => {
			deleteTeamUserServiceMock.commitTransaction.mockRejectedValue(Error);

			await expect(teamService.delete(team1._id)).rejects.toThrowError(BadRequestException);
		});
	});
});

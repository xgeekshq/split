import { faker } from '@faker-js/faker';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { NotFoundException } from '@nestjs/common';
import User from 'src/modules/users/entities/user.schema';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import Team from 'src/modules/teams/entities/team.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { TeamRepositoryInterface } from './../../../../dist/modules/teams/repositories/team.repository.interface.d';
import { getTeamService } from 'src/modules/teams/providers';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as Teams from 'src/modules/teams/interfaces/types';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import { TeamUserFactory } from 'src/libs/test-utils/mocks/factories/teamUser-factory.mock';

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
const team2 = {
	...teams[1],
	users: teamUsersWithUsers
};
const teamsWithUsers = [team1, team2];
const boards = BoardFactory.createMany(5, [
	{ team: team1._id },
	{ team: team1._id },
	{ team: team1._id },
	{ team: team2._id },
	{ team: team2._id }
]);

describe('GetTeamService', () => {
	let teamService: GetTeamServiceInterface;
	let teamRepositoryMock: DeepMocked<TeamRepositoryInterface>;
	let getTeamUserServiceMock: DeepMocked<GetTeamUserServiceInterface>;
	let getBoardServiceMock: DeepMocked<GetBoardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getTeamService,
				{
					provide: Teams.TYPES.repositories.TeamRepository,
					useValue: createMock<TeamRepositoryInterface>()
				},
				{
					provide: TeamUsers.TYPES.services.GetTeamUserService,
					useValue: createMock<GetTeamUserServiceInterface>()
				},
				{
					provide: Boards.TYPES.services.GetBoardService,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();

		teamService = module.get<GetTeamServiceInterface>(getTeamService.provide);
		teamRepositoryMock = module.get(Teams.TYPES.repositories.TeamRepository);
		getTeamUserServiceMock = module.get(TeamUsers.TYPES.services.GetTeamUserService);
		getBoardServiceMock = module.get(Boards.TYPES.services.GetBoardService);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();

		getBoardServiceMock.getAllMainBoards.mockResolvedValue(boards);
		teamRepositoryMock.getAllTeams.mockResolvedValue(teamsWithUsers);
		getTeamUserServiceMock.getAllTeamsOfUser.mockResolvedValue(teamUsers);
	});

	it('should be defined', () => {
		expect(teamService).toBeDefined();
	});

	describe('countAllTeams', () => {
		it('should return the number of existing teams', async () => {
			teamRepositoryMock.countDocuments.mockResolvedValue(teams.length);
			await expect(teamService.countAllTeams()).resolves.toEqual(teams.length);
		});
	});

	describe('getTeam', () => {
		it('should return team with users sorted by name', async () => {
			teamRepositoryMock.getTeam.mockResolvedValue(team1);

			team1.users.sort((a, b) => {
				const userA = a.user as User;
				const userB = b.user as User;

				const fullNameA = `${userA?.firstName.toLowerCase()} ${userA?.lastName.toLowerCase()}`;
				const fullNameB = `${userB?.firstName.toLowerCase()} ${userB?.lastName.toLowerCase()}`;

				return fullNameA < fullNameB ? -1 : 1;
			});

			await expect(teamService.getTeam(team1._id)).resolves.toEqual(team1);
		});

		it('should throw Not Found Exception when team not found', async () => {
			teamRepositoryMock.getTeam.mockResolvedValue(null);

			await expect(teamService.getTeam('-1')).rejects.toThrow(NotFoundException);
			expect(teamRepositoryMock.getTeam).toHaveBeenCalled();
		});
	});

	describe('getTeamsOfUser', () => {
		it('should return teams of user and respective number of boards', async () => {
			teamRepositoryMock.getTeamsWithUsers.mockResolvedValue(teamsWithUsers);
			getBoardServiceMock.getAllMainBoards.mockResolvedValue(boards);

			const userId = teamUsersWithUsers[0]._id;
			const expectedResult = teamsWithUsers.map((team) => ({
				...team,
				boardsCount: boards.filter((board) => String(board.team) === team._id).length
			}));
			const result = await teamService.getTeamsOfUser(userId);

			expect(getTeamUserServiceMock.getAllTeamsOfUser).toHaveBeenCalled();
			expect(teamRepositoryMock.getTeamsWithUsers).toHaveBeenCalled();
			expect(getBoardServiceMock.getAllMainBoards).toHaveBeenCalled();
			expect(result).toEqual(expectedResult);
		});
	});

	describe('getAllTeams', () => {
		it('should return all teams and respective number of boards', async () => {
			const expectedResult = teamsWithUsers.map((team) => ({
				...team,
				boardsCount: boards.filter((board) => String(board.team) === team._id).length
			}));
			const result = await teamService.getAllTeams();

			expect(result).toEqual(expectedResult);
			expect(teamRepositoryMock.getAllTeams).toHaveBeenCalled();
			expect(getBoardServiceMock.getAllMainBoards).toHaveBeenCalled();
		});
	});

	describe('getTeamsUserIsNotMember', () => {
		it('should return an array of objects with team.name and team._id where user is not team member', async () => {
			getTeamUserServiceMock.getAllTeamsOfUser.mockResolvedValue([]);

			const userId = faker.datatype.uuid();

			const expectedResult = teamsWithUsers.map(({ _id, name }) => ({
				_id,
				name
			}));
			const result = await teamService.getTeamsUserIsNotMember(userId);

			expect(result).toEqual(expectedResult);
			expect(teamRepositoryMock.getAllTeams).toHaveBeenCalled();
			expect(getTeamUserServiceMock.getAllTeamsOfUser).toHaveBeenCalled();
		});
	});
});

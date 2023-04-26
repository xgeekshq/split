import { sortTeamUserListAlphabetically } from './../../users/utils/sortings';
import { NotFoundException } from '@nestjs/common';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { TEAM_REPOSITORY } from 'src/modules/teams/constants';
import {
	boards,
	team1,
	teamUsers,
	teamUsersWithUsers,
	teams,
	teamsWithUsers
} from '../applications/get-team-mocked-results';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';
import { GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';
import GetTeamService from './get.team.service';

describe('GetTeamService', () => {
	let teamService: GetTeamServiceInterface;
	let teamRepositoryMock: DeepMocked<TeamRepositoryInterface>;
	let getTeamUserServiceMock: DeepMocked<GetTeamUserServiceInterface>;
	let getBoardServiceMock: DeepMocked<GetBoardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetTeamService,
				{
					provide: TEAM_REPOSITORY,
					useValue: createMock<TeamRepositoryInterface>()
				},
				{
					provide: GET_TEAM_USER_SERVICE,
					useValue: createMock<GetTeamUserServiceInterface>()
				},
				{
					provide: GET_BOARD_SERVICE,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();

		teamService = module.get(GetTeamService);
		teamRepositoryMock = module.get(TEAM_REPOSITORY);
		getTeamUserServiceMock = module.get(GET_TEAM_USER_SERVICE);
		getBoardServiceMock = module.get(GET_BOARD_SERVICE);
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

			team1.users = sortTeamUserListAlphabetically(team1.users);

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
			expect(result).toHaveLength(expectedResult.length);
		});
	});
});

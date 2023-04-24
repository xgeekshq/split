import Team from 'src/modules/teams/entities/team.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { getAllTeamsUseCase } from 'src/modules/teams/providers';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { TEAM_REPOSITORY } from 'src/modules/teams/constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { boards, teamsWithUsers } from './get-team-mocked-results';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';

describe('GetAllTeamsUseCase', () => {
	let getAllTeams: UseCase<void, Team[]>;
	let teamRepositoryMock: DeepMocked<TeamRepositoryInterface>;
	let getBoardServiceMock: DeepMocked<GetBoardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getAllTeamsUseCase,
				{
					provide: TEAM_REPOSITORY,
					useValue: createMock<TeamRepositoryInterface>()
				},
				{
					provide: GET_BOARD_SERVICE,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();

		getAllTeams = module.get<UseCase<void, Team[]>>(getAllTeamsUseCase.provide);
		teamRepositoryMock = module.get(TEAM_REPOSITORY);
		getBoardServiceMock = module.get(GET_BOARD_SERVICE);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();

		teamRepositoryMock.getAllTeams.mockResolvedValue(teamsWithUsers);
		getBoardServiceMock.getAllMainBoards.mockResolvedValue(boards);
	});

	it('should be defined', () => {
		expect(getAllTeams).toBeDefined();
	});

	describe('execute', () => {
		it('should return all teams and respective number of boards', async () => {
			const expectedResult = teamsWithUsers.map((team) => ({
				...team,
				boardsCount: boards.filter((board) => String(board.team) === team._id).length
			}));
			const result = await getAllTeams.execute();

			expect(result).toEqual(expectedResult);
			expect(teamRepositoryMock.getAllTeams).toHaveBeenCalled();
		});
	});
});

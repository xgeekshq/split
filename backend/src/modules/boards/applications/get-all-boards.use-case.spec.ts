import { Test, TestingModule } from '@nestjs/testing';
import * as Boards from 'src/modules/boards/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import faker from '@faker-js/faker';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import { GetAllBoardsUseCaseDto } from './get-all-boards.use-case';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { GetBoardsPaginatedPresenter } from './get-boards-for-dashboard.use-case';
import { getAllBoardsUseCase } from '../boards.providers';

const teams = TeamFactory.createMany(2);
const teamIds = teams.map((team) => team._id);
const boards = BoardFactory.createMany(5, [
	{ isSubBoard: false, team: teamIds[0] },
	{ isSubBoard: false, team: teamIds[0] },
	{ isSubBoard: false, team: null },
	{ isSubBoard: false, team: teamIds[1] },
	{ isSubBoard: true, team: teamIds[1] }
]);
const boardIds = boards.map((board) => board._id);

const userId = faker.datatype.uuid();

describe('GetAllBoardsUseCase', () => {
	let useCase: UseCase<GetAllBoardsUseCaseDto, GetBoardsPaginatedPresenter>;
	let getBoardServiceMock: DeepMocked<GetBoardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getAllBoardsUseCase,
				{
					provide: Boards.TYPES.services.GetBoardService,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();

		useCase = module.get<UseCase<GetAllBoardsUseCaseDto, GetBoardsPaginatedPresenter>>(
			Boards.TYPES.applications.GetAllBoardsUseCase
		);
		getBoardServiceMock = module.get(Boards.TYPES.services.GetBoardService);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		it('should return all the boards of a team', async () => {
			const filterBoardsResponse = boards.filter(
				(board) => !board.isSubBoard && String(board.team) === teams[0]._id
			);

			const teamBoards = { boards: filterBoardsResponse, hasNextPage: false, page: 1 };

			getBoardServiceMock.getBoards.mockResolvedValue(teamBoards);

			const result = await useCase.execute({
				team: teams[0]._id,
				userId,
				isSAdmin: false,
				page: 0,
				size: 10
			});

			expect(getBoardServiceMock.getBoards).toBeCalledTimes(1);

			expect(result).toEqual(teamBoards);
		});

		it('should return all the boards for a superAdmin', async () => {
			const filterBoardsResponse = boards.filter((board) => !board.isSubBoard && board.team);

			const allBoards = { boards: filterBoardsResponse, hasNextPage: false, page: 1 };

			getBoardServiceMock.getBoards.mockResolvedValue(allBoards);

			const result = await useCase.execute({
				team: null,
				userId,
				isSAdmin: true,
				page: 0,
				size: 10
			});

			expect(getBoardServiceMock.getAllBoardIdsAndTeamIdsOfUser).toBeCalledTimes(1);
			expect(getBoardServiceMock.getBoards).toBeCalledTimes(1);

			expect(result).toEqual(allBoards);
		});

		it('should return all the boards of a regular user', async () => {
			const filterBoardsResponse = boards.filter(
				(board) =>
					!board.isSubBoard &&
					(boardIds.includes(board._id) || teamIds.includes(String(board.team)))
			);

			const allBoards = { boards: filterBoardsResponse, hasNextPage: false, page: 1 };

			getBoardServiceMock.getBoards.mockResolvedValue(allBoards);

			const result = await useCase.execute({
				team: null,
				userId,
				isSAdmin: false,
				page: 0,
				size: 10
			});

			expect(getBoardServiceMock.getAllBoardIdsAndTeamIdsOfUser).toBeCalledTimes(1);
			expect(getBoardServiceMock.getBoards).toBeCalledTimes(1);

			expect(result).toEqual(allBoards);
		});
	});
});

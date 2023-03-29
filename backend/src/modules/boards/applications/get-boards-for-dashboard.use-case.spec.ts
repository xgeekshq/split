import { Test, TestingModule } from '@nestjs/testing';
import * as Boards from 'src/modules/boards/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import faker from '@faker-js/faker';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { GetBoardsForDashboardsUseCase } from './get-boards-for-dashboard.use-case';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';

const userId = faker.datatype.uuid();

describe('GetBoardsForDashboardUseCase', () => {
	let useCase: GetBoardsForDashboardsUseCase;
	let getBoardServiceMock: DeepMocked<GetBoardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetBoardsForDashboardsUseCase,
				{
					provide: Boards.TYPES.services.GetBoardService,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();

		useCase = module.get<GetBoardsForDashboardsUseCase>(GetBoardsForDashboardsUseCase);
		getBoardServiceMock = module.get(Boards.TYPES.services.GetBoardService);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		it('should call getAllBoardsIdsAndTeamIdsOfUser', async () => {
			await useCase.execute({ userId, page: 0, size: 10 });

			expect(getBoardServiceMock.getAllBoardIdsAndTeamIdsOfUser).toBeCalledTimes(1);
			expect(getBoardServiceMock.getAllBoardIdsAndTeamIdsOfUser).toBeCalledWith(userId);
		});

		it('should return all the boards of the last 3 months', async () => {
			const boards = BoardFactory.createMany(3);

			const teamIds = [TeamFactory.create()._id];
			boards[0].team = teamIds[0];
			const boardIds = boards.map((board) => board._id);
			const getBoardAndTeamIdsResult = { boardIds, teamIds };
			const filterBoardsResponse = boards.filter(
				(board) =>
					board.isSubBoard && (boardIds.includes(board._id) || teamIds.includes(String(board.team)))
			);
			const boardsOf3LastMonths = { boards: filterBoardsResponse, hasNextPage: false, page: 1 };

			getBoardServiceMock.getAllBoardIdsAndTeamIdsOfUser.mockResolvedValue(
				getBoardAndTeamIdsResult
			);

			getBoardServiceMock.getBoards.mockResolvedValue(boardsOf3LastMonths);

			const result = await useCase.execute({ userId, page: 1, size: 10 });

			expect(getBoardServiceMock.getBoards).toBeCalledTimes(1);

			expect(result).toEqual(boardsOf3LastMonths);
		});
	});
});

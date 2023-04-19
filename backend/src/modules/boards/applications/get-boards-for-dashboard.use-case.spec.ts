import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import faker from '@faker-js/faker';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import GetBoardsUseCaseDto from '../dto/useCase/get-boards.use-case.dto';
import BoardsPaginatedPresenter from '../presenter/boards-paginated.presenter';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { GetBoardsForDashboardUseCase } from './get-boards-for-dashboard.use-case';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';

const userId = faker.datatype.uuid();

describe('GetBoardsForDashboardUseCase', () => {
	let useCase: UseCase<GetBoardsUseCaseDto, BoardsPaginatedPresenter>;
	let getBoardServiceMock: DeepMocked<GetBoardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetBoardsForDashboardUseCase,
				{
					provide: GET_BOARD_SERVICE,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();

		useCase = module.get(GetBoardsForDashboardUseCase);
		getBoardServiceMock = module.get(GET_BOARD_SERVICE);
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

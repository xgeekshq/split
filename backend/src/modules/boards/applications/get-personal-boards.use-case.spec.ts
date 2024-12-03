import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { faker } from '@faker-js/faker';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import GetBoardsUseCaseDto from '../dto/useCase/get-boards.use-case.dto';
import BoardsPaginatedPresenter from '../presenter/boards-paginated.presenter';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { GetPersonalBoardsUseCase } from './get-personal-boards.use-case';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';

const userId = faker.string.uuid();

describe('GetPersonalBoardsUseCase', () => {
	let useCase: UseCase<GetBoardsUseCaseDto, BoardsPaginatedPresenter>;
	let getBoardServiceMock: DeepMocked<GetBoardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetPersonalBoardsUseCase,
				{
					provide: GET_BOARD_SERVICE,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();

		useCase = module.get(GetPersonalBoardsUseCase);
		getBoardServiceMock = module.get(GET_BOARD_SERVICE);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		it('should return all the personal boards of the user', async () => {
			const teamIds = [TeamFactory.create()._id];
			const boards = BoardFactory.createMany(4, [
				{ isSubBoard: false, team: null },
				{ isSubBoard: false, team: null },
				{ isSubBoard: false, team: teamIds[0] },
				{ isSubBoard: true, team: teamIds[0] }
			]);

			const boardIds = boards.map((board) => board._id);
			const getBoardAndTeamIdsResult = { boardIds, teamIds };
			const filterBoardsResponse = boards.filter(
				(board) => !board.isSubBoard && boardIds.includes(board._id) && !board.team
			);

			const boardsResponse = { boards: filterBoardsResponse, hasNextPage: false, page: 1 };

			getBoardServiceMock.getAllBoardIdsAndTeamIdsOfUser.mockResolvedValue(
				getBoardAndTeamIdsResult
			);

			getBoardServiceMock.getBoards.mockResolvedValue(boardsResponse);

			const result = await useCase.execute({ userId, page: 1, size: 10 });

			expect(getBoardServiceMock.getAllBoardIdsAndTeamIdsOfUser).toBeCalledTimes(1);
			expect(getBoardServiceMock.getBoards).toBeCalledTimes(1);
			expect(result).toEqual(boardsResponse);
		});
	});
});

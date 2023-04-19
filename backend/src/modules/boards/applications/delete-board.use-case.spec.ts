import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { NotFoundException } from '@nestjs/common';
import DeleteBoardUseCaseDto from 'src/modules/boards/dto/useCase/delete-board.use-case';
import { BOARD_REPOSITORY, DELETE_BOARD_SERVICE } from 'src/modules/boards/constants';
import { DeleteBoardUseCase } from 'src/modules/boards/applications/delete-board.use-case';

const board = BoardFactory.create({
	dividedBoards: BoardFactory.createMany(2),
	slackEnable: true
});

describe('DeleteBoardUseCase', () => {
	let useCase: UseCase<DeleteBoardUseCaseDto, boolean>;
	let deleteBoardServiceMock: DeepMocked<DeleteBoardServiceInterface>;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeleteBoardUseCase,
				{
					provide: DELETE_BOARD_SERVICE,
					useValue: createMock<DeleteBoardServiceInterface>()
				},
				{
					provide: BOARD_REPOSITORY,
					useValue: createMock<BoardRepositoryInterface>()
				}
			]
		}).compile();

		useCase = module.get(DeleteBoardUseCase);
		deleteBoardServiceMock = module.get(DELETE_BOARD_SERVICE);
		boardRepositoryMock = module.get(BOARD_REPOSITORY);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		boardRepositoryMock.getBoard.mockResolvedValue(board);
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();

		boardRepositoryMock.getBoard.mockResolvedValue(board);
	});

	describe('execute', () => {
		it('should return true if execute succeeds', async () => {
			deleteBoardServiceMock.deleteBoardBoardUsersAndSchedules.mockResolvedValue(true);

			await expect(
				useCase.execute({ boardId: 'boardId', completionHandler: jest.fn() })
			).resolves.toBe(true);
		});

		it('should throw notFoundException when board not found ', async () => {
			boardRepositoryMock.getBoard.mockResolvedValue(null);

			await expect(
				useCase.execute({ boardId: 'boardId', completionHandler: jest.fn() })
			).rejects.toThrow(NotFoundException);
		});

		it('should call completionHandler when execute board is deleted', async () => {
			deleteBoardServiceMock.deleteBoardBoardUsersAndSchedules.mockResolvedValue(true);
			const completionHandlerMock = jest.fn();

			await expect(
				useCase.execute({
					boardId: 'boardId',
					completionHandler: completionHandlerMock
				})
			).resolves.toBe(true);
			expect(completionHandlerMock).toBeCalled();
		});

		it("shouldn't call completionHandler when execute board isn't deleted", async () => {
			deleteBoardServiceMock.deleteBoardBoardUsersAndSchedules.mockResolvedValue(false);
			const completionHandlerMock = jest.fn();

			await expect(
				useCase.execute({
					boardId: 'boardId',
					completionHandler: completionHandlerMock
				})
			).resolves.toBe(false);
			expect(completionHandlerMock).not.toBeCalled();
		});
	});
});

import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { IsBoardPublicUseCase } from './is-board-public.use-case';
import { BOARD_REPOSITORY } from 'src/modules/boards/constants';

const mainBoard = BoardFactory.create({ isSubBoard: false, isPublic: false });

describe('IsBoardPublicUseCase', () => {
	let useCase: UseCase<string, boolean>;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				IsBoardPublicUseCase,
				{
					provide: BOARD_REPOSITORY,
					useValue: createMock<BoardRepositoryInterface>()
				}
			]
		}).compile();

		useCase = module.get(IsBoardPublicUseCase);
		boardRepositoryMock = module.get(BOARD_REPOSITORY);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		it('should return the isPublic status of a board', async () => {
			mainBoard.isPublic = true;

			boardRepositoryMock.isBoardPublic.mockResolvedValue(mainBoard);

			const result = await useCase.execute(mainBoard._id);

			expect(boardRepositoryMock.isBoardPublic).toBeCalledTimes(1);
			expect(result).toEqual(true);
		});

		it('should throw an error if board is not found', async () => {
			boardRepositoryMock.isBoardPublic.mockResolvedValue(null);

			expect(async () => await useCase.execute(mainBoard._id)).rejects.toThrow(NotFoundException);
		});
	});
});

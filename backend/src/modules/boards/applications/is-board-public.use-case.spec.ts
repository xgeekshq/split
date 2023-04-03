import { Test, TestingModule } from '@nestjs/testing';
import * as Boards from 'src/modules/boards/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { isBoardPublicUseCase } from '../boards.providers';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { NotFoundException } from '@nestjs/common';

const mainBoard = BoardFactory.create({ isSubBoard: false, isPublic: false });

describe('IsBoardPublicUseCase', () => {
	let useCase: UseCase<string, boolean>;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				isBoardPublicUseCase,
				{
					provide: Boards.TYPES.repositories.BoardRepository,
					useValue: createMock<BoardRepositoryInterface>()
				}
			]
		}).compile();

		useCase = module.get<UseCase<string, boolean>>(Boards.TYPES.applications.IsBoardPublicUseCase);
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
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
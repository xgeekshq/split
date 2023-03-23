import { Test, TestingModule } from '@nestjs/testing';
import { CreateCardUseCase } from './create-card.use-case';
import { TYPES } from '../interfaces/types';
import { createMock } from '@golevelup/ts-jest';
import { CardRepositoryInterface } from '../repository/card.repository.interface';

describe('CreateCardUseCase', () => {
	let useCase: CreateCardUseCase;
	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateCardUseCase,
				{
					provide: TYPES.repository.CardRepository,
					useValue: createMock<CardRepositoryInterface>()
				}
			]
		}).compile();
		useCase = module.get<CreateCardUseCase>(CreateCardUseCase);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	// 	it('should call cardRepository once', async () => {
	// 		await service.create('someBoardId', 'someUserId', cardDtoMock, boardMock.columns[0]._id);
	// 		expect(cardRepositoryMock.pushCardWithPopulate).toHaveBeenCalledTimes(1);
	// 	});

	// 	it('should return new card when card.items is not empty', async () => {
	// 		const colIndex = boardMock.columns.findIndex(
	// 			(col) => col._id.toString() === boardMock.columns[0]._id
	// 		);

	// 		await expect(
	// 			service.create('someBoardId', 'someUserId', cardDtoMock, boardMock.columns[0]._id)
	// 		).resolves.toEqual(
	// 			expect.objectContaining({
	// 				newCard: boardMock.columns[colIndex].cards[0],
	// 				hideCards: boardMock.hideCards,
	// 				hideVotes: boardMock.hideVotes
	// 			})
	// 		);
	// 	});

	// 	it('should return new card when card.items isEmpty', async () => {
	// 		cardDtoMock.items = [];
	// 		const colIndex = boardMock.columns.findIndex(
	// 			(col) => col._id.toString() === boardMock.columns[0]._id
	// 		);

	// 		await expect(
	// 			service.create('someBoardId', 'someUserId', cardDtoMock, boardMock.columns[0]._id)
	// 		).resolves.toEqual(
	// 			expect.objectContaining({
	// 				newCard: boardMock.columns[colIndex].cards[0],
	// 				hideCards: boardMock.hideCards,
	// 				hideVotes: boardMock.hideVotes
	// 			})
	// 		);
	// 	});

	// 	it('should throw error if board.columns doesnt exists', async () => {
	// 		boardMock.columns = null;
	// 		await expect(
	// 			service.create('someBoardId', 'someUserId', cardDtoMock, 'wrongColId')
	// 		).rejects.toThrowError(HttpException);
	// 	});
});

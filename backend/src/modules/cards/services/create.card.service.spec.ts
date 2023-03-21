import { Test, TestingModule } from '@nestjs/testing';
import { CreateCardServiceInterface } from '../interfaces/services/create.card.service.interface';
import CreateCardService from './create.card.service';
import { TYPES } from '../interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import { CardDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/cardDto-factory.mock';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { HttpException } from '@nestjs/common';

const cardDtoMock = CardDtoFactory.create();
const boardMock = BoardFactory.create();
describe('CreateCardService', () => {
	let service: CreateCardServiceInterface;
	let cardRepositoryMock: DeepMocked<CardRepositoryInterface>;
	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateCardService,
				{
					provide: TYPES.repository.CardRepository,
					useValue: createMock<CardRepositoryInterface>()
				}
			]
		}).compile();
		service = module.get<CreateCardServiceInterface>(CreateCardService);
		cardRepositoryMock = module.get(TYPES.repository.CardRepository);
		cardRepositoryMock.pushCardWithPopulate.mockResolvedValue(boardMock);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should call cardRepository once', async () => {
		await service.create('someBoardId', 'someUserId', cardDtoMock, boardMock.columns[0]._id);
		expect(cardRepositoryMock.pushCardWithPopulate).toHaveBeenCalledTimes(1);
	});

	it('should return new card when card.items is not empty', async () => {
		const colIndex = boardMock.columns.findIndex(
			(col) => col._id.toString() === boardMock.columns[0]._id
		);

		await expect(
			service.create('someBoardId', 'someUserId', cardDtoMock, boardMock.columns[0]._id)
		).resolves.toEqual(
			expect.objectContaining({
				newCard: boardMock.columns[colIndex].cards[0],
				hideCards: boardMock.hideCards,
				hideVotes: boardMock.hideVotes
			})
		);
	});

	it('should return new card when card.items isEmpty', async () => {
		cardDtoMock.items = [];
		const colIndex = boardMock.columns.findIndex(
			(col) => col._id.toString() === boardMock.columns[0]._id
		);

		await expect(
			service.create('someBoardId', 'someUserId', cardDtoMock, boardMock.columns[0]._id)
		).resolves.toEqual(
			expect.objectContaining({
				newCard: boardMock.columns[colIndex].cards[0],
				hideCards: boardMock.hideCards,
				hideVotes: boardMock.hideVotes
			})
		);
	});

	it('should throw error if board.columns doesnt exists', async () => {
		boardMock.columns = null;
		await expect(
			service.create('someBoardId', 'someUserId', cardDtoMock, 'wrongColId')
		).rejects.toThrowError(HttpException);
	});
});

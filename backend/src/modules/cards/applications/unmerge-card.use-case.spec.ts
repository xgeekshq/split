import { Test, TestingModule } from '@nestjs/testing';
import { TYPES } from '../interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import { UnmergeCardUseCase } from './unmerge-card.use-case';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import UnmergeCardUseCaseDto from '../dto/useCase/unmerge-card.use-case.dto';
import faker from '@faker-js/faker';
import { CardFactory } from 'src/libs/test-utils/mocks/factories/card-factory.mock';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { BadRequestException } from '@nestjs/common';

const unmergeCardDto: UnmergeCardUseCaseDto = {
	boardId: faker.datatype.uuid(),
	cardGroupId: faker.datatype.uuid(),
	draggedCardId: faker.datatype.uuid(),
	columnId: faker.datatype.uuid(),
	position: faker.datatype.number()
};

const updateResultMock = {
	acknowledged: true,
	matchedCount: 1,
	modifiedCount: 1,
	upsertedCount: 1,
	upsertedId: null
};
const cardMock = CardFactory.create();
const boardMock = BoardFactory.create();

describe('UnmergeCardUseCase', () => {
	let useCase: UnmergeCardUseCase;
	let cardRepositoryMock: DeepMocked<CardRepositoryInterface>;
	let cardServiceMock: DeepMocked<GetCardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UnmergeCardUseCase,
				{
					provide: TYPES.services.GetCardService,
					useValue: createMock<GetCardServiceInterface>()
				},
				{
					provide: TYPES.repository.CardRepository,
					useValue: createMock<CardRepositoryInterface>()
				}
			]
		}).compile();
		useCase = module.get<UnmergeCardUseCase>(UnmergeCardUseCase);
		cardRepositoryMock = module.get(TYPES.repository.CardRepository);
		cardServiceMock = module.get(TYPES.services.GetCardService);
		cardServiceMock.getCardItemFromGroup.mockResolvedValue(cardMock);
		cardServiceMock.getCardFromBoard.mockResolvedValue(cardMock);
		cardRepositoryMock.pullItem.mockResolvedValue(updateResultMock);
		cardRepositoryMock.updateCardFromGroupOnUnmerge.mockResolvedValue(boardMock);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	it('should call repository startTransaction', async () => {
		await useCase.execute(unmergeCardDto);
		expect(cardRepositoryMock.startTransaction).toHaveBeenCalledTimes(1);
	});

	it('should call repository commitTransaction', async () => {
		await useCase.execute(unmergeCardDto);
		expect(cardRepositoryMock.commitTransaction).toHaveBeenCalledTimes(1);
	});

	it('should call repository endSession', async () => {
		await useCase.execute(unmergeCardDto);
		expect(cardRepositoryMock.endSession).toHaveBeenCalledTimes(1);
	});

	it('should call cardService.getCardItemFromGroup with boardId and draggedCardId', async () => {
		await useCase.execute(unmergeCardDto);
		expect(cardServiceMock.getCardItemFromGroup).toHaveBeenNthCalledWith(
			1,
			unmergeCardDto.boardId,
			unmergeCardDto.draggedCardId
		);
	});
	it('should throw badRequest if getCardItemFromGroup fails', async () => {
		cardServiceMock.getCardItemFromGroup.mockResolvedValueOnce(null);
		await expect(useCase.execute(unmergeCardDto)).rejects.toThrow(BadRequestException);
	});
	it('should call pullItem ', async () => {
		await useCase.execute(unmergeCardDto);
		expect(cardRepositoryMock.pullItem).toHaveBeenNthCalledWith(
			1,
			unmergeCardDto.boardId,
			unmergeCardDto.draggedCardId,
			true
		);
	});
	it('should throw badRequest if pullItem fails', async () => {
		updateResultMock.modifiedCount = 2;
		cardRepositoryMock.pullItem.mockResolvedValueOnce(updateResultMock);

		await expect(useCase.execute(unmergeCardDto)).rejects.toThrow(BadRequestException);
		updateResultMock.modifiedCount = 1;
	});

	it('should call cardService.getCardFromBoard with boardId and cardGroupId', async () => {
		await useCase.execute(unmergeCardDto);
		expect(cardServiceMock.getCardFromBoard).toHaveBeenNthCalledWith(
			1,
			unmergeCardDto.boardId,
			unmergeCardDto.cardGroupId
		);
	});

	it('should throw badRequest if cardGroup not found', async () => {
		cardServiceMock.getCardFromBoard.mockResolvedValueOnce(null);
		await expect(useCase.execute(unmergeCardDto)).rejects.toThrow(BadRequestException);
	});

	it('should throw badRequest if getCardFromBoard the new card', async () => {
		const newCardSavedMock = CardFactory.create();
		newCardSavedMock.items[0]._id = null;
		cardServiceMock.getCardFromBoard
			.mockResolvedValueOnce(cardMock)
			.mockResolvedValueOnce(newCardSavedMock);

		await expect(useCase.execute(unmergeCardDto)).rejects.toThrow(BadRequestException);
	});

	it('should throw badRequest if getCardFromBoard the new card', async () => {
		cardServiceMock.getCardFromBoard.mockRejectedValueOnce(Error);
		await expect(useCase.execute(unmergeCardDto)).rejects.toThrow(BadRequestException);
	});
});

import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import { TYPES } from '../interfaces/types';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import MergeCardUseCaseDto from '../dto/useCase/merge-card.use-case.dto';
import faker from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { CardFactory } from 'src/libs/test-utils/mocks/factories/card-factory.mock';
import { UpdateResult } from 'mongodb';
import { CardItemFactory } from 'src/libs/test-utils/mocks/factories/cardItem-factory.mock';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { mergeCardUseCase } from '../cards.providers';

const mergeCardDtoMock: MergeCardUseCaseDto = {
	boardId: faker.datatype.uuid(),
	draggedCardId: faker.datatype.uuid(),
	targetCardId: faker.datatype.uuid()
};
const cardMock = CardFactory.createMany(2, [
	{ items: CardItemFactory.createMany(1) },
	{ items: CardItemFactory.createMany(1) }
]);
const updateResult: UpdateResult = {
	acknowledged: true,
	matchedCount: 1,
	modifiedCount: 1,
	upsertedCount: 1,
	upsertedId: null
};

describe('MergeCardUseCase', () => {
	let useCase: UseCase<MergeCardUseCaseDto, boolean>;
	let cardRepositoryMock: DeepMocked<CardRepositoryInterface>;
	let getCardServiceMock: DeepMocked<GetCardServiceInterface>;
	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				mergeCardUseCase,
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
		useCase = module.get<UseCase<MergeCardUseCaseDto, boolean>>(
			TYPES.applications.MergeCardUseCase
		);
		getCardServiceMock = module.get(TYPES.services.GetCardService);
		cardRepositoryMock = module.get(TYPES.repository.CardRepository);

		getCardServiceMock.getCardFromBoard
			.mockResolvedValue(cardMock[0])
			.mockResolvedValue(cardMock[1]);
		cardRepositoryMock.pullCard.mockResolvedValue(updateResult);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});
	it('should ', async () => {
		await useCase.execute(mergeCardDtoMock);
		await expect(cardRepositoryMock.updateCardOnMerge).toHaveBeenNthCalledWith(
			1,
			mergeCardDtoMock.boardId,
			mergeCardDtoMock.targetCardId,
			expect.anything(),
			expect.anything(),
			expect.anything(),
			true
		);
	});

	it('should throw badRequest if getCardFromBoard not found', async () => {
		getCardServiceMock.getCardFromBoard.mockResolvedValueOnce(null);
		await expect(useCase.execute(mergeCardDtoMock)).rejects.toThrow(BadRequestException);
	});

	it('should throw badRequest if repository pullCard not found', async () => {
		cardRepositoryMock.pullCard.mockResolvedValueOnce(null);
		await expect(useCase.execute(mergeCardDtoMock)).rejects.toThrow(BadRequestException);
	});

	it('should throw badRequest if getCardFromBoard not found', async () => {
		getCardServiceMock.getCardFromBoard
			.mockResolvedValueOnce(cardMock[0])
			.mockResolvedValueOnce(null);
		await expect(useCase.execute(mergeCardDtoMock)).rejects.toThrow(BadRequestException);
	});

	it('should throw badRequest if pullResult.modifiedCount different then 1', async () => {
		updateResult.modifiedCount = 2;
		await expect(useCase.execute(mergeCardDtoMock)).rejects.toThrow(BadRequestException);
		updateResult.modifiedCount = 1;
	});

	it('should throw badRequest if updateCardMerge fails', async () => {
		cardRepositoryMock.updateCardOnMerge.mockResolvedValue(null);
		await expect(useCase.execute(mergeCardDtoMock)).rejects.toThrow(BadRequestException);
	});

	it('should throw badRequest with default message when a non expected error occurs', async () => {
		cardRepositoryMock.updateCardOnMerge.mockRejectedValueOnce(Error);
		await expect(useCase.execute(mergeCardDtoMock)).rejects.toThrow(BadRequestException);
	});
});

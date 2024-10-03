import { Test, TestingModule } from '@nestjs/testing';
import { CARD_REPOSITORY } from '../../constants';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CardRepositoryInterface } from '../../repository/card.repository.interface';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { faker } from '@faker-js/faker';
import { UpdateResult } from 'mongodb';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { Logger } from '@nestjs/common';
import UpdateCardTextUseCaseDto from '../../dto/useCase/update-card-text.use-case.dto';
import { UpdateCardTextUseCase } from 'src/modules/cards/applications/update/update-card-text.use-case';

const updateCardTextDto: UpdateCardTextUseCaseDto = {
	boardId: faker.string.uuid(),
	cardId: faker.string.uuid(),
	cardItemId: faker.string.uuid(),
	userId: faker.string.uuid(),
	text: faker.string.alpha(),
	completionHandler() {
		return;
	}
};

const board = BoardFactory.create();

const updateResult: UpdateResult = {
	acknowledged: true,
	matchedCount: 1,
	modifiedCount: 1,
	upsertedCount: 1,
	upsertedId: null
};

describe('UpdateCardTextUseCase', () => {
	let useCase: UseCase<UpdateCardTextUseCaseDto, void>;
	let cardRepositoryMock: DeepMocked<CardRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateCardTextUseCase,
				{
					provide: CARD_REPOSITORY,
					useValue: createMock<CardRepositoryInterface>()
				}
			]
		}).compile();
		useCase = module.get(UpdateCardTextUseCase);
		cardRepositoryMock = module.get(CARD_REPOSITORY);
		cardRepositoryMock.updateCardText.mockResolvedValue(board);

		jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		updateResult.modifiedCount = 1;
		cardRepositoryMock.pullCard.mockResolvedValue(updateResult);
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		it('should call update card text', async () => {
			await useCase.execute(updateCardTextDto);
			expect(cardRepositoryMock.updateCardText).toHaveBeenNthCalledWith(
				1,
				updateCardTextDto.boardId,
				updateCardTextDto.cardId,
				updateCardTextDto.cardItemId,
				updateCardTextDto.userId,
				updateCardTextDto.text
			);
		});
		it('should throw error when update card text fails', async () => {
			cardRepositoryMock.updateCardText.mockResolvedValueOnce(null);
			await expect(useCase.execute(updateCardTextDto)).rejects.toThrow(UpdateFailedException);
		});
	});
});

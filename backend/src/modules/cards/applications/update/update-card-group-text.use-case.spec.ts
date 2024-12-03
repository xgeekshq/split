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
import UpdateCardGroupTextUseCaseDto from '../../dto/useCase/update-card-group-text.use-case.dto';
import { UpdateCardGroupTextUseCase } from 'src/modules/cards/applications/update/update-card-group-text.use-case';

const updateCardGroupTextDto: UpdateCardGroupTextUseCaseDto = {
	boardId: faker.string.uuid(),
	cardId: faker.string.uuid(),
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

describe('UpdateCardGroupTextUseCase', () => {
	let useCase: UseCase<UpdateCardGroupTextUseCaseDto, void>;
	let cardRepositoryMock: DeepMocked<CardRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateCardGroupTextUseCase,
				{
					provide: CARD_REPOSITORY,
					useValue: createMock<CardRepositoryInterface>()
				}
			]
		}).compile();
		useCase = module.get(UpdateCardGroupTextUseCase);
		cardRepositoryMock = module.get(CARD_REPOSITORY);
		cardRepositoryMock.updateCardGroupText.mockResolvedValue(board);

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
			await useCase.execute(updateCardGroupTextDto);
			expect(cardRepositoryMock.updateCardGroupText).toHaveBeenNthCalledWith(
				1,
				updateCardGroupTextDto.boardId,
				updateCardGroupTextDto.cardId,
				updateCardGroupTextDto.userId,
				updateCardGroupTextDto.text
			);
		});
		it('should throw error when update card text fails', async () => {
			cardRepositoryMock.updateCardGroupText.mockResolvedValueOnce(null);
			await expect(useCase.execute(updateCardGroupTextDto)).rejects.toThrow(UpdateFailedException);
		});
	});
});

import { Test, TestingModule } from '@nestjs/testing';
import { TYPES } from '../../interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CardRepositoryInterface } from '../../repository/card.repository.interface';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { updateCardGroupTextUseCase } from '../../cards.providers';
import faker from '@faker-js/faker';
import { UpdateResult } from 'mongodb';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { Logger } from '@nestjs/common';
import UpdateCardGroupTextUseCaseDto from '../../dto/useCase/update-card-group-text.use-case.dto';

const updateCardGroupTextDto: UpdateCardGroupTextUseCaseDto = {
	boardId: faker.datatype.uuid(),
	cardId: faker.datatype.uuid(),
	userId: faker.datatype.uuid(),
	text: faker.datatype.string(),
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
				updateCardGroupTextUseCase,
				{
					provide: TYPES.repository.CardRepository,
					useValue: createMock<CardRepositoryInterface>()
				}
			]
		}).compile();
		useCase = module.get<UseCase<UpdateCardGroupTextUseCaseDto, void>>(
			TYPES.applications.UpdateCardGroupTextUseCase
		);
		cardRepositoryMock = module.get(TYPES.repository.CardRepository);
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

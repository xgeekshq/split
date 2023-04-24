import { Test, TestingModule } from '@nestjs/testing';
import { CARD_REPOSITORY, GET_CARD_SERVICE } from '../../constants';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CardRepositoryInterface } from '../../repository/card.repository.interface';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import UpdateCardPositionUseCaseDto from '../../dto/useCase/update-card-position.use-case.dto';
import { GetCardServiceInterface } from '../../interfaces/services/get.card.service.interface';
import faker from '@faker-js/faker';
import { CardFactory } from 'src/libs/test-utils/mocks/factories/card-factory.mock';
import { UpdateResult } from 'mongodb';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { Logger } from '@nestjs/common';
import { UpdateCardPositionUseCase } from 'src/modules/cards/applications/update/update-card-position.use-case';

const updateCardPosition: UpdateCardPositionUseCaseDto = {
	boardId: faker.datatype.uuid(),
	cardId: faker.datatype.uuid(),
	targetColumnId: faker.datatype.uuid(),
	newPosition: faker.datatype.number({ max: 3 }),
	completionHandler() {
		return;
	}
};
const card = CardFactory.create();
const board = BoardFactory.create();

const updateResult: UpdateResult = {
	acknowledged: true,
	matchedCount: 1,
	modifiedCount: 1,
	upsertedCount: 1,
	upsertedId: null
};

describe('UpdateCardPositionUseCase', () => {
	let useCase: UseCase<UpdateCardPositionUseCaseDto, void>;
	let cardRepositoryMock: DeepMocked<CardRepositoryInterface>;
	let getCardServiceMock: DeepMocked<GetCardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateCardPositionUseCase,
				{
					provide: GET_CARD_SERVICE,
					useValue: createMock<GetCardServiceInterface>()
				},
				{
					provide: CARD_REPOSITORY,
					useValue: createMock<CardRepositoryInterface>()
				}
			]
		}).compile();
		useCase = module.get(UpdateCardPositionUseCase);
		cardRepositoryMock = module.get(CARD_REPOSITORY);
		getCardServiceMock = module.get(GET_CARD_SERVICE);

		getCardServiceMock.getCardFromBoard.mockResolvedValue(card);
		cardRepositoryMock.pushCard.mockResolvedValue(board);

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

	it('should start, commit and end card repository on success', async () => {
		await useCase.execute(updateCardPosition);

		expect(cardRepositoryMock.startTransaction).toHaveBeenCalledTimes(1);

		expect(cardRepositoryMock.commitTransaction).toHaveBeenCalledTimes(1);

		expect(cardRepositoryMock.endSession).toHaveBeenCalledTimes(1);
	});

	it('should call abort card repository when error occurs', async () => {
		cardRepositoryMock.pushCard.mockRejectedValueOnce(UpdateFailedException);

		await expect(useCase.execute(updateCardPosition)).rejects.toThrow(UpdateFailedException);

		expect(cardRepositoryMock.startTransaction).toHaveBeenCalledTimes(1);

		expect(cardRepositoryMock.commitTransaction).not.toHaveBeenCalledTimes(1);

		expect(cardRepositoryMock.abortTransaction).toHaveBeenCalledTimes(1);

		expect(cardRepositoryMock.endSession).toHaveBeenCalledTimes(1);
	});

	describe('execute', () => {
		it('should get card to move', async () => {
			await useCase.execute(updateCardPosition);

			expect(getCardServiceMock.getCardFromBoard).toHaveBeenNthCalledWith(
				1,
				updateCardPosition.boardId,
				updateCardPosition.cardId
			);
		});

		it('should throw error if card to move not found', async () => {
			getCardServiceMock.getCardFromBoard.mockResolvedValueOnce(null);
			await expect(useCase.execute(updateCardPosition)).rejects.toThrow(UpdateFailedException);
		});
	});

	describe('updateCardPosition', () => {
		it('should pull card ', async () => {
			await useCase.execute(updateCardPosition);

			expect(cardRepositoryMock.pullCard).toHaveBeenNthCalledWith(
				1,
				updateCardPosition.boardId,
				updateCardPosition.cardId,
				true
			);
		});
		it('should throw error if pull card failed ', async () => {
			updateResult.modifiedCount = 0;
			cardRepositoryMock.pullCard.mockResolvedValueOnce(updateResult);
			await expect(useCase.execute(updateCardPosition)).rejects.toThrow(UpdateFailedException);
		});
		it('should push card to the new position ', async () => {
			await useCase.execute(updateCardPosition);

			expect(cardRepositoryMock.pushCard).toHaveBeenNthCalledWith(
				1,
				updateCardPosition.boardId,
				updateCardPosition.targetColumnId,
				updateCardPosition.newPosition,
				expect.objectContaining(card),
				true
			);
		});
		it('should throw error if push card failed ', async () => {
			cardRepositoryMock.pushCard.mockResolvedValueOnce(null);
			await expect(useCase.execute(updateCardPosition)).rejects.toThrow(UpdateFailedException);
		});
	});
});

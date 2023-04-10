import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import { TYPES } from '../interfaces/types';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import { DeleteCardUseCase } from './delete-card.use-case';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import DeleteCardUseCaseDto from '../dto/useCase/delete-card.use-case.dto';
import faker from '@faker-js/faker';
import { BulkWriteResult, UpdateResult } from 'mongodb';
import { CardFactory } from 'src/libs/test-utils/mocks/factories/card-factory.mock';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import { UseCase } from 'src/libs/interfaces/use-case.interface';

const deleteCardMock: DeleteCardUseCaseDto = {
	boardId: faker.datatype.uuid(),
	cardId: faker.datatype.uuid(),
	completionHandler() {
		return;
	}
};

const updateResult: UpdateResult = {
	acknowledged: true,
	matchedCount: 1,
	modifiedCount: 1,
	upsertedCount: 1,
	upsertedId: null
};

const cardMock = CardFactory.create();
cardMock.votes = [faker.datatype.uuid(), faker.datatype.uuid()];
cardMock.items[0].votes = [faker.datatype.uuid(), faker.datatype.uuid()];

const bulkWriteResult = {
	ok: 1
};

describe('DeleteCardUseCase', () => {
	let useCase: UseCase<DeleteCardUseCaseDto, void>;
	let cardRepositoryMock: DeepMocked<CardRepositoryInterface>;
	let updateBoardUserServiceMock: DeepMocked<UpdateBoardUserServiceInterface>;
	let getCardServiceMock: DeepMocked<GetCardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeleteCardUseCase,
				{
					provide: TYPES.services.GetCardService,
					useValue: createMock<GetCardServiceInterface>()
				},
				{
					provide: BoardUsers.TYPES.services.UpdateBoardUserService,
					useValue: createMock<GetCardServiceInterface>()
				},
				{
					provide: TYPES.repository.CardRepository,
					useValue: createMock<UpdateBoardUserServiceInterface>()
				}
			]
		}).compile();
		useCase = module.get<UseCase<DeleteCardUseCaseDto, void>>(DeleteCardUseCase);
		cardRepositoryMock = module.get(TYPES.repository.CardRepository);
		updateBoardUserServiceMock = module.get(BoardUsers.TYPES.services.UpdateBoardUserService);
		getCardServiceMock = module.get(TYPES.services.GetCardService);
		cardRepositoryMock.updateCardsFromBoard.mockResolvedValue(updateResult);
		getCardServiceMock.getCardFromBoard.mockResolvedValue(cardMock);
		updateBoardUserServiceMock.updateManyUserVotes.mockResolvedValue(
			bulkWriteResult as unknown as BulkWriteResult
		);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	it('should start cardRepository and updateBoardUserService transaction', async () => {
		await useCase.execute(deleteCardMock);

		expect(cardRepositoryMock.startTransaction).toHaveBeenCalledTimes(1);
		expect(updateBoardUserServiceMock.startTransaction).toHaveBeenCalledTimes(1);

		expect(updateBoardUserServiceMock.commitTransaction).toHaveBeenCalledTimes(1);
		expect(cardRepositoryMock.commitTransaction).toHaveBeenCalledTimes(1);

		expect(updateBoardUserServiceMock.endSession).toHaveBeenCalledTimes(1);
		expect(cardRepositoryMock.endSession).toHaveBeenCalledTimes(1);
	});

	it('should throw error if card not found', async () => {
		getCardServiceMock.getCardFromBoard.mockResolvedValueOnce(null);

		await expect(useCase.execute(deleteCardMock)).rejects.toThrow(DeleteFailedException);
		//Abort Transactions
		expect(cardRepositoryMock.abortTransaction).toHaveBeenCalledTimes(1);
		expect(updateBoardUserServiceMock.abortTransaction).toHaveBeenCalledTimes(1);
		//End session
		expect(updateBoardUserServiceMock.endSession).toHaveBeenCalledTimes(1);
		expect(cardRepositoryMock.endSession).toHaveBeenCalledTimes(1);
	});

	it('should call updateBoardUserService.UpdateManyUserVotes', async () => {
		await useCase.execute(deleteCardMock);
		expect(updateBoardUserServiceMock.updateManyUserVotes).toHaveBeenNthCalledWith(
			1,
			deleteCardMock.boardId,
			expect.any(Object),
			true,
			true
		);
	});

	it('should throw error when update fails', async () => {
		updateBoardUserServiceMock.updateManyUserVotes.mockResolvedValueOnce({
			ok: 0
		} as unknown as BulkWriteResult);

		await expect(useCase.execute(deleteCardMock)).rejects.toThrow(DeleteFailedException);
		//Abort Transactions
		expect(cardRepositoryMock.abortTransaction).toHaveBeenCalledTimes(1);
		expect(updateBoardUserServiceMock.abortTransaction).toHaveBeenCalledTimes(1);
		//End session
		expect(updateBoardUserServiceMock.endSession).toHaveBeenCalledTimes(1);
		expect(cardRepositoryMock.endSession).toHaveBeenCalledTimes(1);
	});

	it('should call cardRepository.updateCardsFromBoard', async () => {
		await useCase.execute(deleteCardMock);
		expect(cardRepositoryMock.updateCardsFromBoard).toHaveBeenCalledTimes(1);
	});

	it('should call throw error if cardRepository.updateCardsFromBoard fails', async () => {
		cardRepositoryMock.updateCardsFromBoard.mockResolvedValueOnce({
			modifiedCount: 2
		} as unknown as UpdateResult);
		await expect(useCase.execute(deleteCardMock)).rejects.toThrow(DeleteFailedException);
	});

	it('should call throw error if some unexpected error occurs fails', async () => {
		cardRepositoryMock.updateCardsFromBoard.mockRejectedValue(Error);
		await expect(useCase.execute(deleteCardMock)).rejects.toThrow(DeleteFailedException);
	});
});

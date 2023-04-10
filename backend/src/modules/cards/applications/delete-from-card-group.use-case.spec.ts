import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import { TYPES } from '../interfaces/types';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import faker from '@faker-js/faker';
import { BulkWriteResult, UpdateResult } from 'mongodb';
import { CardFactory } from 'src/libs/test-utils/mocks/factories/card-factory.mock';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import { DeleteFromCardGroupUseCase } from './delete-from-card-group.use-case';
import DeleteFromCardGroupUseCaseDto from '../dto/useCase/delete-fom-card-group.use-case.dto';
import { CardItemFactory } from 'src/libs/test-utils/mocks/factories/cardItem-factory.mock';
import { UseCase } from 'src/libs/interfaces/use-case.interface';

const deleteFromCardGroupMock: DeleteFromCardGroupUseCaseDto = {
	boardId: faker.datatype.uuid(),
	cardId: faker.datatype.uuid(),
	cardItemId: faker.datatype.uuid(),
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
const updateResultFail: UpdateResult = {
	acknowledged: true,
	matchedCount: 1,
	modifiedCount: 2,
	upsertedCount: 1,
	upsertedId: null
};

const cardMock = CardFactory.create();
cardMock.votes = [faker.datatype.uuid(), faker.datatype.uuid()];
cardMock.items[0].votes = [faker.datatype.uuid(), faker.datatype.uuid()];

const bulkWriteResult = {
	ok: 1
};

const cardItem = CardItemFactory.create();
cardItem.votes = [faker.datatype.uuid(), faker.datatype.uuid()];

describe('DeleteFromCardGroupUseCase', () => {
	let useCase: UseCase<DeleteFromCardGroupUseCaseDto, void>;
	let cardRepositoryMock: DeepMocked<CardRepositoryInterface>;
	let updateBoardUserServiceMock: DeepMocked<UpdateBoardUserServiceInterface>;
	let getCardServiceMock: DeepMocked<GetCardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeleteFromCardGroupUseCase,
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
		useCase = module.get<UseCase<DeleteFromCardGroupUseCaseDto, void>>(DeleteFromCardGroupUseCase);
		cardRepositoryMock = module.get(TYPES.repository.CardRepository);
		updateBoardUserServiceMock = module.get(BoardUsers.TYPES.services.UpdateBoardUserService);
		getCardServiceMock = module.get(TYPES.services.GetCardService);

		updateBoardUserServiceMock.updateManyUserVotes.mockResolvedValue(
			bulkWriteResult as unknown as BulkWriteResult
		);

		cardRepositoryMock.deleteCardFromCardItems.mockResolvedValue(updateResult);

		getCardServiceMock.getCardFromBoard.mockResolvedValue(cardMock);
		getCardServiceMock.getCardItemFromGroup.mockResolvedValue(cardItem);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});
	describe('transactions', () => {
		it('should start cardRepository and updateBoardUserService transaction', async () => {
			await useCase.execute(deleteFromCardGroupMock);

			expect(cardRepositoryMock.startTransaction).toHaveBeenCalledTimes(1);
			expect(updateBoardUserServiceMock.startTransaction).toHaveBeenCalledTimes(1);

			expect(updateBoardUserServiceMock.commitTransaction).toHaveBeenCalledTimes(1);
			expect(cardRepositoryMock.commitTransaction).toHaveBeenCalledTimes(1);

			expect(updateBoardUserServiceMock.endSession).toHaveBeenCalledTimes(1);
			expect(cardRepositoryMock.endSession).toHaveBeenCalledTimes(1);

			expect(updateBoardUserServiceMock.abortTransaction).not.toHaveBeenCalledTimes(1);
			expect(cardRepositoryMock.abortTransaction).not.toHaveBeenCalledTimes(1);
		});

		it('should call abort repository if error occurs', async () => {
			updateBoardUserServiceMock.updateManyUserVotes.mockRejectedValueOnce(Error);
			await expect(useCase.execute(deleteFromCardGroupMock)).rejects.toThrow(DeleteFailedException);

			expect(cardRepositoryMock.startTransaction).toHaveBeenCalledTimes(1);
			expect(updateBoardUserServiceMock.startTransaction).toHaveBeenCalledTimes(1);

			expect(updateBoardUserServiceMock.abortTransaction).toHaveBeenCalledTimes(1);
			expect(cardRepositoryMock.abortTransaction).toHaveBeenCalledTimes(1);

			expect(updateBoardUserServiceMock.endSession).toHaveBeenCalledTimes(1);
			expect(cardRepositoryMock.endSession).toHaveBeenCalledTimes(1);

			expect(updateBoardUserServiceMock.commitTransaction).not.toHaveBeenCalledTimes(1);
			expect(cardRepositoryMock.commitTransaction).not.toHaveBeenCalledTimes(1);
		});
	});

	describe('execute', () => {
		it('should call getCardService.getCardFromBoard', async () => {
			await useCase.execute(deleteFromCardGroupMock);

			expect(getCardServiceMock.getCardFromBoard).toHaveBeenCalledTimes(1);
		});

		it('should throw error if card not found', async () => {
			getCardServiceMock.getCardFromBoard.mockResolvedValueOnce(null);
			await expect(useCase.execute(deleteFromCardGroupMock)).rejects.toThrow(DeleteFailedException);
		});

		it('should call cardRepository.deleteCardFromCardItems', async () => {
			await useCase.execute(deleteFromCardGroupMock);

			expect(cardRepositoryMock.deleteCardFromCardItems).toHaveBeenCalledTimes(1);
		});

		it('should throw error if deleteCardFromCardItems fails', async () => {
			getCardServiceMock.getCardFromBoard.mockResolvedValueOnce(null);
			await expect(useCase.execute(deleteFromCardGroupMock)).rejects.toThrow(DeleteFailedException);
		});

		it('should throw error if cardRepository.deleteCardFromCardItems fails', async () => {
			cardRepositoryMock.deleteCardFromCardItems.mockResolvedValueOnce(updateResultFail);
			await expect(useCase.execute(deleteFromCardGroupMock)).rejects.toThrow(DeleteFailedException);
		});
	});

	describe('remove user votes ', () => {
		it('should get card item from group', async () => {
			await useCase.execute(deleteFromCardGroupMock);
			expect(getCardServiceMock.getCardItemFromGroup).toHaveBeenCalledTimes(1);
		});
		it('should throw error if card item not found ', async () => {
			getCardServiceMock.getCardItemFromGroup.mockResolvedValueOnce(null);
			await expect(useCase.execute(deleteFromCardGroupMock)).rejects.toThrow(DeleteFailedException);
		});
		it('should call updateBoardUserService.updateManyUserVotes', async () => {
			await useCase.execute(deleteFromCardGroupMock);
			expect(updateBoardUserServiceMock.updateManyUserVotes).toHaveBeenCalledTimes(1);
		});
		it('should throw error if updateBoardUserService.updateManyUserVotes fails ', async () => {
			updateBoardUserServiceMock.updateManyUserVotes.mockResolvedValueOnce({
				ok: 0
			} as unknown as BulkWriteResult);
			await expect(useCase.execute(deleteFromCardGroupMock)).rejects.toThrow(DeleteFailedException);
		});
	});
	describe('refactorLastItem', () => {
		it('should call cardRepository.refactorLastCardItedm', async () => {
			await useCase.execute(deleteFromCardGroupMock);
			expect(cardRepositoryMock.refactorLastCardItem).toHaveBeenCalledTimes(1);
		});
		it('should throw error if cardRepository.refactorLastCardItem fails ', async () => {
			cardRepositoryMock.refactorLastCardItem.mockResolvedValueOnce(null);
			await expect(useCase.execute(deleteFromCardGroupMock)).rejects.toThrow(DeleteFailedException);
		});
	});
});

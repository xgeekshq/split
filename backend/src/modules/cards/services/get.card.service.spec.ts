import { Test, TestingModule } from '@nestjs/testing';
import { TYPES } from '../constants';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import GetCardService from './get.card.service';
import { CardFactory } from 'src/libs/test-utils/mocks/factories/card-factory.mock';
import { CardItemFactory } from 'src/libs/test-utils/mocks/factories/cardItem-factory.mock';

const boardIdMock = '6419a5d8517b67960074e3fb';
const cardIdMock = '6419c8313ac30a5680c72baa';
const cardItemIdMock = '6419c8313ac30a5680c72bab';
const cards = CardFactory.createMany(1);
const cardItem = CardItemFactory.createMany(1);

describe('GetCardService', () => {
	let service: GetCardServiceInterface;
	let cardRepositoryMock: DeepMocked<CardRepositoryInterface>;
	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetCardService,
				{
					provide: TYPES.repository.CardRepository,
					useValue: createMock<CardRepositoryInterface>()
				}
			]
		}).compile();
		service = module.get<GetCardServiceInterface>(GetCardService);
		cardRepositoryMock = module.get(TYPES.repository.CardRepository);
		cardRepositoryMock.getCardFromBoard.mockResolvedValue(cards);
		cardRepositoryMock.getCardItemFromGroup.mockResolvedValue(cardItem);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getCardFromBoard', () => {
		it('should call cardRepository.getCardFromBoard with boardId and cardId', async () => {
			await service.getCardFromBoard(boardIdMock, cardIdMock);
			expect(cardRepositoryMock.getCardFromBoard).toHaveBeenNthCalledWith(
				1,
				boardIdMock,
				cardIdMock
			);
		});
	});

	it('should return a card if finds one', async () => {
		await expect(service.getCardFromBoard(boardIdMock, cardIdMock)).resolves.toEqual(cards[0]);
	});

	it('should return null if doesnt find card', async () => {
		cardRepositoryMock.getCardFromBoard.mockResolvedValue(null);
		await expect(service.getCardFromBoard(boardIdMock, cardIdMock)).resolves.toEqual(null);
	});

	describe('getCardItemFromGroup', () => {
		it('should call cardRepository.getCardItemFromGroup with boardId and cardItemId', async () => {
			await service.getCardItemFromGroup(boardIdMock, cardItemIdMock);
			expect(cardRepositoryMock.getCardItemFromGroup).toHaveBeenNthCalledWith(
				1,
				boardIdMock,
				cardItemIdMock
			);
		});

		it('should return a cardItem if finds one', async () => {
			await expect(service.getCardItemFromGroup(boardIdMock, cardIdMock)).resolves.toEqual(
				cardItem[0]
			);
		});

		it('should return null if doesnt find cardItem', async () => {
			cardRepositoryMock.getCardItemFromGroup.mockResolvedValue(null);
			await expect(service.getCardItemFromGroup(boardIdMock, cardIdMock)).resolves.toEqual(null);
		});
	});
});

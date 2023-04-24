import { Test, TestingModule } from '@nestjs/testing';
import { CARD_REPOSITORY } from '../constants';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import faker from '@faker-js/faker';
import { CardDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/cardDto-factory.mock';
import CreateCardUseCaseDto from '../dto/useCase/create-card.use-case.dto';
import { CardFactory } from 'src/libs/test-utils/mocks/factories/card-factory.mock';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { CardItemDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/cardItemDto-factory.mock';
import { CardItemFactory } from 'src/libs/test-utils/mocks/factories/cardItem-factory.mock';
import { hideText } from 'src/libs/utils/hideText';
import User from 'src/modules/users/entities/user.schema';
import { BadRequestException, HttpException } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import CardCreationPresenter from '../dto/useCase/presenters/create-card-res.use-case.dto';
import { CreateCardUseCase } from 'src/modules/cards/applications/create-card.use-case';

//Create Card Items Mocks
const cardIdtemDto = CardItemDtoFactory.create({ text: 'New Card', comments: [] });

const cardItemFactory = CardItemFactory.create({
	_id: cardIdtemDto._id,
	text: cardIdtemDto.text,
	comments: [],
	anonymous: cardIdtemDto.anonymous,
	votes: cardIdtemDto.votes
});

//Create Card Mocks
const cardDtoMock = CardDtoFactory.create({
	_id: faker.datatype.uuid(),
	text: 'New Card',
	comments: [],
	votes: [],
	items: [cardIdtemDto]
});

const newCardMock = CardFactory.create({
	_id: cardDtoMock._id,
	text: cardDtoMock.text,
	comments: [],
	votes: [],
	items: [cardItemFactory]
});

let boardMock;
let createCardUseCaseDtoMock: CreateCardUseCaseDto;

describe('CreateCardUseCase', () => {
	let useCase: UseCase<CreateCardUseCaseDto, CardCreationPresenter>;
	let cardRepositoryMock: DeepMocked<CardRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateCardUseCase,
				{
					provide: CARD_REPOSITORY,
					useValue: createMock<CardRepositoryInterface>()
				}
			]
		}).compile();
		useCase = module.get(CreateCardUseCase);
		cardRepositoryMock = module.get(CARD_REPOSITORY);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		//Create Mock Board
		boardMock = BoardFactory.create();
		boardMock.columns[0]._id = 'colId';
		boardMock.columns[0].cards[0] = newCardMock;
		cardRepositoryMock.pushCardWithPopulate.mockResolvedValue(boardMock);

		//Create Mock CreateCardUseCaseDto
		createCardUseCaseDtoMock = {
			boardId: faker.datatype.uuid(),
			userId: faker.datatype.uuid(),
			createCardDto: {
				socketId: faker.datatype.uuid(),
				colIdToAdd: 'colId',
				card: cardDtoMock,
				boardId: faker.datatype.uuid(),
				newCard: null
			}
		};
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	it('should call cardRepository once', async () => {
		await useCase.execute(createCardUseCaseDtoMock);
		expect(cardRepositoryMock.pushCardWithPopulate).toHaveBeenCalledTimes(1);
	});

	it('should return new card and send a card with hidden data for the websocket', async () => {
		boardMock.hideCards = true;
		boardMock.hideVotes = true;

		cardRepositoryMock.pushCardWithPopulate.mockResolvedValueOnce(boardMock);
		await expect(useCase.execute(createCardUseCaseDtoMock)).resolves.toEqual(
			expect.objectContaining({
				newCardToReturn: expect.objectContaining({ _id: cardDtoMock._id, text: cardDtoMock.text }),
				newCardToSocket: expect.objectContaining({
					text: hideText(cardDtoMock.text),
					createdBy: expect.objectContaining({
						firstName: hideText((newCardMock.createdBy as User).firstName),
						lastName: hideText((newCardMock.createdBy as User).lastName)
					})
				})
			})
		);
	});

	it('should return new card and a card with no hidden data for the websocket', async () => {
		boardMock.hideCards = false;
		boardMock.hideVotes = false;
		boardMock.columns[0].cards[0].anonymous = false;
		boardMock.columns[0].cards[0].createdByTeam = null;

		cardRepositoryMock.pushCardWithPopulate.mockResolvedValueOnce(boardMock);
		await expect(useCase.execute(createCardUseCaseDtoMock)).resolves.toEqual(
			expect.objectContaining({
				newCardToReturn: expect.objectContaining({ _id: cardDtoMock._id, text: cardDtoMock.text }),
				newCardToSocket: expect.objectContaining({
					text: cardDtoMock.text,
					createdBy: expect.objectContaining({
						firstName: (newCardMock.createdBy as User).firstName,
						lastName: (newCardMock.createdBy as User).lastName
					})
				})
			})
		);
	});

	it('should return new card when card.items isEmpty', async () => {
		createCardUseCaseDtoMock.createCardDto.card.items = [];

		await expect(useCase.execute(createCardUseCaseDtoMock)).resolves.toEqual(
			expect.objectContaining({
				newCardToReturn: expect.objectContaining({
					items: expect.arrayContaining([expect.objectContaining({ text: cardDtoMock.text })])
				})
			})
		);
	});

	it('should throw error if board.columns doesnt exists', async () => {
		boardMock.columns = null;
		cardRepositoryMock.pushCardWithPopulate.mockResolvedValueOnce(boardMock);
		await expect(useCase.execute(createCardUseCaseDtoMock)).rejects.toThrowError(HttpException);
	});

	it('should return BadRequestException if insert fail ', async () => {
		createCardUseCaseDtoMock.createCardDto.colIdToAdd = 'FakeColId';
		await expect(useCase.execute(createCardUseCaseDtoMock)).rejects.toThrowError(
			BadRequestException
		);
	});
});

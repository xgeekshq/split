import { Test, TestingModule } from '@nestjs/testing';
import { TYPES } from '../interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import { UpdateBoardServiceInterface } from 'src/modules/boards/interfaces/services/update.board.service.interface';
import faker from '@faker-js/faker';
import Board from 'src/modules/boards/entities/board.schema';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { CardFactory } from 'src/libs/test-utils/mocks/factories/card-factory.mock';
import CardItem from 'src/modules/cards/entities/card.item.schema';
import Card from 'src/modules/cards/entities/card.schema';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';
import { CardItemVoteUseCase } from './card-item-vote.use-case';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { INSERT_VOTE_FAILED } from 'src/libs/exceptions/messages';
import CardItemVoteUseCaseDto from '../dto/useCase/card-item-vote.use-case.dto';

const userId: string = faker.datatype.uuid();
const board: Board = BoardFactory.create({ maxVotes: 3 });
const card: Card = CardFactory.create();
const cardItem: CardItem = card.items[0];

describe('CardItemVoteUseCase', () => {
	let useCase: UseCase<CardItemVoteUseCaseDto, void>;
	let voteRepositoryMock: DeepMocked<VoteRepositoryInterface>;
	let createVoteServiceMock: DeepMocked<CreateVoteServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CardItemVoteUseCase,
				{
					provide: TYPES.repositories.VoteRepository,
					useValue: createMock<VoteRepositoryInterface>()
				},
				{
					provide: TYPES.services.CreateVoteService,
					useValue: createMock<CreateVoteServiceInterface>()
				},
				{
					provide: BoardUsers.TYPES.services.UpdateBoardUserService,
					useValue: createMock<UpdateBoardServiceInterface>()
				}
			]
		}).compile();

		useCase = module.get(CardItemVoteUseCase);
		voteRepositoryMock = module.get(TYPES.repositories.VoteRepository);
		createVoteServiceMock = module.get(TYPES.services.CreateVoteService);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		createVoteServiceMock.canUserVote.mockResolvedValue();
		createVoteServiceMock.incrementVoteUser.mockResolvedValue();
		voteRepositoryMock.insertCardItemVote.mockResolvedValue(board);
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		it('should throw an error when the canUserVote function returns error', async () => {
			try {
				createVoteServiceMock.canUserVote.mockRejectedValueOnce(new InsertFailedException());

				await useCase.execute({
					boardId: board._id,
					cardId: card._id,
					userId,
					cardItemId: cardItem._id,
					count: 1
				});
			} catch (ex) {
				expect(ex).toBeInstanceOf(InsertFailedException);
			}
		});

		it('should throw an error when the addVoteToCardAndUser fails', async () => {
			//if createVoteServiceMock.incrementVoteUser fails
			try {
				createVoteServiceMock.incrementVoteUser.mockRejectedValueOnce(INSERT_VOTE_FAILED);

				await useCase.execute({
					boardId: board._id,
					cardId: card._id,
					userId,
					cardItemId: cardItem._id,
					count: 1
				});
			} catch (ex) {
				expect(ex).toBeInstanceOf(InsertFailedException);
			}

			//if voteRepositoryMock.insertCardItemVote fails
			try {
				voteRepositoryMock.insertCardItemVote.mockResolvedValueOnce(null);
				await useCase.execute({
					boardId: board._id,
					cardId: card._id,
					userId,
					cardItemId: cardItem._id,
					count: 1
				});
			} catch (ex) {
				expect(ex).toBeInstanceOf(InsertFailedException);
			}

			//if the error code is WRITE_ERROR_LOCK and the retryCount is less than 5
			try {
				voteRepositoryMock.insertCardItemVote.mockRejectedValueOnce({ code: WRITE_LOCK_ERROR });
				await useCase.execute({
					boardId: board._id,
					cardId: card._id,
					userId,
					cardItemId: cardItem._id,
					count: 1
				});
			} catch (ex) {
				expect(ex).toBeInstanceOf(InsertFailedException);
			}
		});

		it('should call all the functions when execute  succeeds', async () => {
			await useCase.execute({
				boardId: board._id,
				cardId: card._id,
				userId,
				cardItemId: cardItem._id,
				count: 1
			});
			expect(createVoteServiceMock.canUserVote).toBeCalled();
			expect(createVoteServiceMock.incrementVoteUser).toBeCalled();
			expect(voteRepositoryMock.insertCardItemVote).toBeCalled();
		});

		it('should throw an error when a commit transaction fails', async () => {
			voteRepositoryMock.commitTransaction.mockRejectedValueOnce('Commit transaction failed');

			expect(
				async () =>
					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						cardItemId: cardItem._id,
						count: 1
					})
			).rejects.toThrow(InsertFailedException);
		});
	});
});

import { Test, TestingModule } from '@nestjs/testing';
import { CREATE_VOTE_SERVICE, TYPES } from '../constants';
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
import { DeleteVoteServiceInterface } from '../interfaces/services/delete.vote.service.interface';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { UPDATE_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';

const userId: string = faker.datatype.uuid();
const board: Board = BoardFactory.create({ maxVotes: 3 });
const boardUser: BoardUser = BoardUserFactory.create({ board: board._id, votesCount: 1 });
const card: Card = CardFactory.create({ votes: [boardUser._id, userId] });
const cardItem: CardItem = card.items[0];
cardItem.votes = [boardUser._id, userId];
const completionHandler = () => {
	return;
};

describe('CardItemVoteUseCase', () => {
	let useCase: UseCase<CardItemVoteUseCaseDto, void>;
	let voteRepositoryMock: DeepMocked<VoteRepositoryInterface>;
	let createVoteServiceMock: DeepMocked<CreateVoteServiceInterface>;

	let deleteVoteServiceMock: DeepMocked<DeleteVoteServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CardItemVoteUseCase,
				{
					provide: TYPES.repositories.VoteRepository,
					useValue: createMock<VoteRepositoryInterface>()
				},
				{
					provide: TYPES.services.DeleteVoteService,
					useValue: createMock<DeleteVoteServiceInterface>()
				},
				{
					provide: CREATE_VOTE_SERVICE,
					useValue: createMock<CreateVoteServiceInterface>()
				},
				{
					provide: UPDATE_BOARD_USER_SERVICE,
					useValue: createMock<UpdateBoardServiceInterface>()
				}
			]
		}).compile();

		useCase = module.get(CardItemVoteUseCase);
		voteRepositoryMock = module.get(TYPES.repositories.VoteRepository);
		createVoteServiceMock = module.get(CREATE_VOTE_SERVICE);
		deleteVoteServiceMock = module.get(TYPES.services.DeleteVoteService);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		//insert vote on card item
		createVoteServiceMock.canUserVote.mockResolvedValue();
		createVoteServiceMock.incrementVoteUser.mockResolvedValue();
		voteRepositoryMock.insertCardItemVote.mockResolvedValue(board);

		//delete vote from card item
		deleteVoteServiceMock.canUserDeleteVote.mockResolvedValue();
		deleteVoteServiceMock.getCardItemFromBoard.mockResolvedValue(cardItem);
		deleteVoteServiceMock.removeVotesFromCardItem.mockResolvedValue();
		deleteVoteServiceMock.decrementVoteUser.mockResolvedValue();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		describe('add vote to cardItem', () => {
			it('should throw an error when the canUserVote function returns error', async () => {
				try {
					createVoteServiceMock.canUserVote.mockRejectedValueOnce(new InsertFailedException());

					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						cardItemId: cardItem._id,
						count: 1,
						completionHandler
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
						count: 1,
						completionHandler
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
						count: 1,
						completionHandler
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
						count: 1,
						completionHandler
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
					count: 1,
					completionHandler
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
							count: 1,
							completionHandler
						})
				).rejects.toThrow(InsertFailedException);
			});
		});

		describe('delete vote from cardItem', () => {
			it('should throw an error when the deleteVoteService.canUserDeleteVote function returns error', async () => {
				try {
					deleteVoteServiceMock.canUserDeleteVote.mockRejectedValueOnce(
						new DeleteFailedException()
					);

					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						cardItemId: cardItem._id,
						count: -1,
						completionHandler
					});
				} catch (ex) {
					expect(ex).toBeInstanceOf(DeleteFailedException);
				}
			});

			it('should throw an error if the deleteVoteService.getCardItemFromBoard function fails', async () => {
				try {
					deleteVoteServiceMock.getCardItemFromBoard.mockRejectedValueOnce(
						new DeleteFailedException()
					);

					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						cardItemId: cardItem._id,
						count: -1,
						completionHandler
					});
				} catch (ex) {
					expect(ex).toBeInstanceOf(DeleteFailedException);
				}
			});

			it('should throw an error when the deleteVoteFromCard function fails', async () => {
				//if the error code is WRITE_ERROR_LOCK and the retryCount is less than 5
				try {
					deleteVoteServiceMock.removeVotesFromCardItem.mockRejectedValueOnce({
						code: WRITE_LOCK_ERROR
					});
					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						cardItemId: cardItem._id,
						count: -1,
						completionHandler
					});
				} catch (ex) {
					expect(ex).toBeInstanceOf(DeleteFailedException);
				}

				//if voteRepositoryMock.removeVotesFromCardItem fails
				try {
					deleteVoteServiceMock.removeVotesFromCardItem.mockResolvedValueOnce(null);
					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						cardItemId: cardItem._id,
						count: -1,
						completionHandler
					});
				} catch (ex) {
					expect(ex).toBeInstanceOf(DeleteFailedException);
				}

				//if deleteVoteService.decrementVoteUser fails
				try {
					deleteVoteServiceMock.decrementVoteUser.mockResolvedValueOnce(null);
					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						cardItemId: cardItem._id,
						count: -1,
						completionHandler
					});
				} catch (ex) {
					expect(ex).toBeInstanceOf(DeleteFailedException);
				}
			});

			it('should call all the functions when execute  succeeds', async () => {
				deleteVoteServiceMock.getCardItemFromBoard.mockResolvedValue(card);

				await useCase.execute({
					boardId: board._id,
					cardId: card._id,
					userId,
					cardItemId: cardItem._id,
					count: -1,
					completionHandler
				});

				expect(deleteVoteServiceMock.canUserDeleteVote).toBeCalled();
				expect(deleteVoteServiceMock.removeVotesFromCardItem).toBeCalled();
				expect(deleteVoteServiceMock.decrementVoteUser).toBeCalled();
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
							count: -1,
							completionHandler
						})
				).rejects.toThrow(DeleteFailedException);
			});
		});
	});
});

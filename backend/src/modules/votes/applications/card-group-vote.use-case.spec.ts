import { Test, TestingModule } from '@nestjs/testing';
import { CREATE_VOTE_SERVICE, DELETE_VOTE_SERVICE, VOTE_REPOSITORY } from '../constants';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import { UpdateBoardServiceInterface } from 'src/modules/boards/interfaces/services/update.board.service.interface';
import { faker } from '@faker-js/faker';
import Board from 'src/modules/boards/entities/board.schema';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { CardFactory } from 'src/libs/test-utils/mocks/factories/card-factory.mock';
import Card from 'src/modules/cards/entities/card.schema';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { INSERT_VOTE_FAILED } from 'src/libs/exceptions/messages';
import { CardGroupVoteUseCase } from './card-group-vote.use-case';
import CardGroupVoteUseCaseDto from '../dto/useCase/card-group-vote.use-case.dto';
import { DeleteVoteServiceInterface } from '../interfaces/services/delete.vote.service.interface';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import CardItem from 'src/modules/cards/entities/card.item.schema';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';
import { UPDATE_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';

const userId: string = faker.string.uuid();
const board: Board = BoardFactory.create({ maxVotes: 3 });
const boardUser: BoardUser = BoardUserFactory.create({ board: board._id, votesCount: 1 });
const card: Card = CardFactory.create({ votes: [boardUser._id, userId] });
const cardItem: CardItem = card.items[0];
cardItem.votes = [boardUser._id, userId];
const completionHandler = () => {
	return;
};

describe('CardGroupVoteUseCase', () => {
	let useCase: UseCase<CardGroupVoteUseCaseDto, void>;
	let voteRepositoryMock: DeepMocked<VoteRepositoryInterface>;
	let createVoteServiceMock: DeepMocked<CreateVoteServiceInterface>;
	let deleteVoteServiceMock: DeepMocked<DeleteVoteServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CardGroupVoteUseCase,
				{
					provide: VOTE_REPOSITORY,
					useValue: createMock<VoteRepositoryInterface>()
				},
				{
					provide: DELETE_VOTE_SERVICE,
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

		useCase = module.get(CardGroupVoteUseCase);
		voteRepositoryMock = module.get(VOTE_REPOSITORY);
		createVoteServiceMock = module.get(CREATE_VOTE_SERVICE);
		deleteVoteServiceMock = module.get(DELETE_VOTE_SERVICE);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		//insert vote on card group
		createVoteServiceMock.canUserVote.mockResolvedValue();
		createVoteServiceMock.incrementVoteUser.mockResolvedValue();
		voteRepositoryMock.insertCardGroupVote.mockResolvedValue(board);

		//delete vote from card group
		deleteVoteServiceMock.canUserDeleteVote.mockResolvedValue();
		deleteVoteServiceMock.getCardFromBoard.mockResolvedValue(card);
		deleteVoteServiceMock.removeVotesFromCardItem.mockResolvedValue();
		deleteVoteServiceMock.decrementVoteUser.mockResolvedValue();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		describe('deleteVotesFormCardItem', () => {
			it('should throw an error when the canUserVote function returns error', async () => {
				createVoteServiceMock.canUserVote.mockRejectedValue(new InsertFailedException());

				expect(
					async () =>
						await useCase.execute({
							boardId: board._id,
							cardId: card._id,
							userId,
							count: 1,
							completionHandler
						})
				).rejects.toThrowError(InsertFailedException);
			});

			it('should throw an error when the addVoteToCardAndUser fails', async () => {
				//if createVoteServiceMock.incrementVoteUser fails
				try {
					createVoteServiceMock.incrementVoteUser.mockRejectedValueOnce(INSERT_VOTE_FAILED);

					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						count: 1,
						completionHandler
					});
				} catch (ex) {
					expect(ex).toBeInstanceOf(InsertFailedException);
				}

				//if voteRepositoryMock.insertCardGroupVote fails
				try {
					voteRepositoryMock.insertCardGroupVote.mockResolvedValueOnce(null);
					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						count: 1,
						completionHandler
					});
				} catch (ex) {
					expect(ex).toBeInstanceOf(InsertFailedException);
				}

				//if the error code is WRITE_ERROR_LOCK and the retryCount is less than 5
				try {
					voteRepositoryMock.insertCardGroupVote.mockRejectedValue({ code: WRITE_LOCK_ERROR });
					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						count: 1,
						completionHandler
					});
				} catch (ex) {
					expect(ex).toBeInstanceOf(InsertFailedException);
				}
			});

			it('should call all the functions when execute succeeds', async () => {
				await useCase.execute({
					boardId: board._id,
					cardId: card._id,
					userId,
					count: 1,
					completionHandler
				});
				expect(createVoteServiceMock.canUserVote).toBeCalled();
				expect(createVoteServiceMock.incrementVoteUser).toBeCalled();
				expect(voteRepositoryMock.insertCardGroupVote).toBeCalled();
			});

			it('should throw an error when a commit transaction fails', async () => {
				voteRepositoryMock.commitTransaction.mockRejectedValueOnce('Commit transaction failed');

				expect(
					async () =>
						await useCase.execute({
							boardId: board._id,
							cardId: card._id,
							userId,
							count: 1,
							completionHandler
						})
				).rejects.toThrow(InsertFailedException);
			});
		});

		describe('deleteVoteFromCardGroup', () => {
			it('should throw an error when the deleteVoteService.canUserDeleteVote function returns error', async () => {
				deleteVoteServiceMock.canUserDeleteVote.mockRejectedValue(new DeleteFailedException());

				expect(
					async () =>
						await useCase.execute({
							boardId: board._id,
							cardId: card._id,
							userId,
							count: -1,
							completionHandler
						})
				).rejects.toThrowError(DeleteFailedException);
			});

			it('should throw an error when the deleteVoteService.getCardFromBoard function returns error', async () => {
				deleteVoteServiceMock.getCardFromBoard.mockRejectedValue(new DeleteFailedException());

				expect(
					async () =>
						await useCase.execute({
							boardId: board._id,
							cardId: card._id,
							userId,
							count: -1,
							completionHandler
						})
				).rejects.toThrowError(DeleteFailedException);
			});

			it('should throw an error when the deleteCardGroupAndUserVotes function fails on voteRepositoryMock.removeVotesFromCard', async () => {
				voteRepositoryMock.removeVotesFromCard.mockRejectedValue({
					code: WRITE_LOCK_ERROR
				});
				expect(
					async () =>
						await useCase.execute({
							boardId: board._id,
							cardId: card._id,
							userId,
							count: -1,
							completionHandler
						})
				).rejects.toThrowError(DeleteFailedException);
			});

			it('should throw an error when the deleteCardGroupAndUserVotes (voteRepositoryMock.removeVotesFromCard) function fails', async () => {
				voteRepositoryMock.removeVotesFromCard.mockResolvedValue(null);
				expect(
					async () =>
						await useCase.execute({
							boardId: board._id,
							cardId: card._id,
							userId,
							count: -1,
							completionHandler
						})
				).rejects.toThrowError(DeleteFailedException);
			});

			it('should call all the functions when deleteCardGroupAndUserVotes function succeeds', async () => {
				const cardWithVotes: Card = CardFactory.create({ votes: [userId, userId] });
				const cardItemWithVotes: CardItem = cardWithVotes.items[0];
				cardItemWithVotes.votes = [userId, userId];

				deleteVoteServiceMock.getCardFromBoard.mockResolvedValue(cardWithVotes);
				voteRepositoryMock.removeVotesFromCard.mockResolvedValue(board);
				deleteVoteServiceMock.getCardItemFromBoard.mockResolvedValue(cardItemWithVotes);
				deleteVoteServiceMock.removeVotesFromCardItem.mockResolvedValue();
				deleteVoteServiceMock.decrementVoteUser.mockResolvedValue();

				await useCase.execute({
					boardId: board._id,
					cardId: cardWithVotes._id,
					userId,
					count: -4,
					completionHandler
				});

				expect(deleteVoteServiceMock.canUserDeleteVote).toBeCalled();
				expect(deleteVoteServiceMock.getCardFromBoard).toBeCalled();
				expect(voteRepositoryMock.removeVotesFromCard).toBeCalled();
				expect(deleteVoteServiceMock.decrementVoteUser).toBeCalled();
				expect(deleteVoteServiceMock.removeVotesFromCardItem).toBeCalled();
			});

			it("should thrown error inside deleteCardItemAndUserVotes function when a cardItem isn't found", async () => {
				const cardWithoutVotes: Card = CardFactory.create({ votes: [] });

				const cardItem: CardItem = cardWithoutVotes.items[0];
				const boardUser = BoardUserFactory.create();
				cardItem.votes = [boardUser._id];

				deleteVoteServiceMock.getCardFromBoard.mockResolvedValue(cardWithoutVotes);

				deleteVoteServiceMock.getCardFromBoard
					.mockResolvedValueOnce(cardWithoutVotes)
					.mockResolvedValueOnce(cardWithoutVotes);

				expect(
					async () =>
						await useCase.execute({
							boardId: board._id,
							cardId: card._id,
							userId,
							count: -1,
							completionHandler
						})
				).rejects.toThrowError(DeleteFailedException);
			});

			it('should throw an error when the deleteVoteFromCardItemOnCardGroup fails', async () => {
				const cardWithoutVotes: Card = CardFactory.create({ votes: [] });
				const cardItemWithVotes: CardItem = cardWithoutVotes.items[0];
				cardItemWithVotes.votes = [userId];

				deleteVoteServiceMock.getCardFromBoard.mockResolvedValue(cardWithoutVotes);
				voteRepositoryMock.removeVotesFromCard.mockResolvedValue(board);
				deleteVoteServiceMock.getCardItemFromBoard.mockResolvedValue(cardItemWithVotes);

				//if the error code is WRITE_ERROR_LOCK and the retryCount is less than 5
				try {
					deleteVoteServiceMock.removeVotesFromCardItem.mockRejectedValueOnce({
						code: WRITE_LOCK_ERROR
					});
					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						count: -1,
						completionHandler
					});
				} catch (ex) {
					expect(ex).toBeInstanceOf(DeleteFailedException);
				}

				//if voteRepositoryMock.removeVotesFromCardItem fails
				try {
					deleteVoteServiceMock.removeVotesFromCardItem.mockRejectedValueOnce(null);
					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						count: -1,
						completionHandler
					});
				} catch (ex) {
					expect(ex).toBeInstanceOf(DeleteFailedException);
				}

				//if updateBoardUserServiceMock.updateBoardUserRole
				try {
					deleteVoteServiceMock.decrementVoteUser.mockRejectedValue(null);
					await useCase.execute({
						boardId: board._id,
						cardId: card._id,
						userId,
						count: -1,
						completionHandler
					});
				} catch (ex) {
					expect(ex).toBeInstanceOf(DeleteFailedException);
				}
			});

			it('should throw an error when a commit transaction fails', async () => {
				voteRepositoryMock.commitTransaction.mockRejectedValue('Commit transaction failed');

				expect(
					async () =>
						await useCase.execute({
							boardId: board._id,
							cardId: card._id,
							userId,
							count: -1,
							completionHandler
						})
				).rejects.toThrow(DeleteFailedException);
			});
		});
	});
});

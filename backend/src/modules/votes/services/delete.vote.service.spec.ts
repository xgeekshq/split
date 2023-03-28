import { Test, TestingModule } from '@nestjs/testing';
import { TYPES } from '../interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as Cards from 'src/modules/cards/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { UpdateBoardServiceInterface } from 'src/modules/boards/interfaces/services/update.board.service.interface';
import faker from '@faker-js/faker';
import Board from 'src/modules/boards/entities/board.schema';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { CardFactory } from 'src/libs/test-utils/mocks/factories/card-factory.mock';
import CardItem from 'src/modules/cards/entities/card.item.schema';
import Card from 'src/modules/cards/entities/card.schema';
import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import DeleteVoteService from './delete.vote.service';
import { GetCardServiceInterface } from 'src/modules/cards/interfaces/services/get.card.service.interface';
import { DeleteVoteServiceInterface } from '../interfaces/services/delete.vote.service.interface';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import { CardItemFactory } from 'src/libs/test-utils/mocks/factories/cardItem-factory.mock';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';

const userId: string = faker.datatype.uuid();
const board: Board = BoardFactory.create({ maxVotes: 3 });
const boardUser: BoardUser = BoardUserFactory.create({ board: board._id, votesCount: 1 });
const card: Card = CardFactory.create({ votes: [boardUser._id, userId] });
const cardItem: CardItem = card.items[0];
cardItem.votes = [boardUser._id, userId];

describe('DeleteVoteService', () => {
	let voteService: DeleteVoteServiceInterface;
	let voteRepositoryMock: DeepMocked<VoteRepositoryInterface>;
	let getBoardServiceMock: DeepMocked<GetBoardServiceInterface>;
	let getBoardUserServiceMock: DeepMocked<GetBoardUserServiceInterface>;
	let getCardServiceMock: DeepMocked<GetCardServiceInterface>;
	let updateBoardUserServiceMock: DeepMocked<UpdateBoardUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeleteVoteService,
				{
					provide: TYPES.repositories.VoteRepository,
					useValue: createMock<VoteRepositoryInterface>()
				},
				{
					provide: BoardUsers.TYPES.services.GetBoardUserService,
					useValue: createMock<GetBoardUserServiceInterface>()
				},
				{
					provide: BoardUsers.TYPES.services.UpdateBoardUserService,
					useValue: createMock<UpdateBoardServiceInterface>()
				},
				{
					provide: Cards.TYPES.services.GetCardService,
					useValue: createMock<GetCardServiceInterface>()
				},
				{
					provide: Boards.TYPES.services.GetBoardService,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();
		voteService = module.get<DeleteVoteServiceInterface>(DeleteVoteService);
		voteRepositoryMock = module.get(TYPES.repositories.VoteRepository);
		getBoardServiceMock = module.get(Boards.TYPES.services.GetBoardService);
		getBoardUserServiceMock = module.get(BoardUsers.TYPES.services.GetBoardUserService);
		getCardServiceMock = module.get(Cards.TYPES.services.GetCardService);
		updateBoardUserServiceMock = module.get(BoardUsers.TYPES.services.UpdateBoardUserService);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		getBoardServiceMock.getBoardById.mockResolvedValue(board);
		getCardServiceMock.getCardFromBoard.mockResolvedValue(card);
		getBoardUserServiceMock.getBoardUser.mockResolvedValue(boardUser);
		updateBoardUserServiceMock.updateVoteUser.mockResolvedValue({ ...boardUser, votesCount: 1 });
		voteRepositoryMock.insertCardItemVote.mockResolvedValue(board);
		voteRepositoryMock.insertCardGroupVote.mockResolvedValue(board);
	});

	it('should be defined', () => {
		expect(voteService).toBeDefined();
	});

	describe('decrementVoteUser', () => {
		it('should throw an error when updateBoardUserService.updateVoteUser fails', async () => {
			updateBoardUserServiceMock.updateVoteUser.mockResolvedValue(null);

			expect(async () => await voteService.decrementVoteUser(board._id, userId)).rejects.toThrow(
				UpdateFailedException
			);
		});
	});

	describe('deleteVoteFromCard', () => {
		it('should throw an error when the canUserDeleteVote function returns false', async () => {
			//if board is not found
			try {
				getBoardServiceMock.getBoardById.mockResolvedValueOnce(null);

				await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}

			// if boardUser is not found
			try {
				getBoardUserServiceMock.getBoardUser.mockResolvedValueOnce(null);

				await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}

			//if card is not found
			try {
				getCardServiceMock.getCardFromBoard.mockResolvedValueOnce(null);

				await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}

			//if the cardItem votes does't include the vote of the userId
			try {
				const cardItemResult: CardItem = { ...cardItem, votes: [boardUser._id] };
				const cardResult: Card = { ...card, items: [cardItemResult] };

				getCardServiceMock.getCardFromBoard.mockResolvedValueOnce(cardResult);

				await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}

			//if the votes count of the boardUser is less than zero
			try {
				getBoardUserServiceMock.getBoardUser.mockResolvedValueOnce({ ...boardUser, votesCount: 1 });

				await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 2);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}
		});

		it('should throw an error if the getCardItem is not found', async () => {
			getCardServiceMock.getCardFromBoard.mockResolvedValue({
				...card,
				items: [CardItemFactory.create()]
			});
			expect(
				async () =>
					await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(DeleteFailedException);
		});

		it('should throw an error when the removeVotesFromCardItemAndUserOperations fails', async () => {
			//if the error code is WRITE_ERROR_LOCK and the retryCount is less than 5
			try {
				voteRepositoryMock.removeVotesFromCardItem.mockRejectedValueOnce({
					code: WRITE_LOCK_ERROR
				});
				await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}

			//if voteRepositoryMock.removeVotesFromCardItem fails
			try {
				voteRepositoryMock.removeVotesFromCardItem.mockResolvedValueOnce(null);
				await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}

			//if updateBoardUserServiceMock.updateBoardUserRole
			try {
				updateBoardUserServiceMock.updateBoardUserRole.mockResolvedValueOnce(null);
				await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}
		});

		it('should call all functions if the deleteVoteFromCard function is successful', async () => {
			await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1);
			expect(getBoardServiceMock.getBoardById).toBeCalledTimes(1);
			expect(getBoardUserServiceMock.getBoardUser).toBeCalledTimes(1);
			expect(getCardServiceMock.getCardFromBoard).toBeCalledTimes(2);
			expect(voteRepositoryMock.removeVotesFromCardItem).toBeCalled();
			expect(updateBoardUserServiceMock.updateVoteUser).toBeCalled();
		});

		it('should throw an error when a commit transaction fails', async () => {
			voteRepositoryMock.commitTransaction.mockRejectedValueOnce('Commit transaction failed');

			expect(
				async () =>
					await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(DeleteFailedException);
		});
	});
});

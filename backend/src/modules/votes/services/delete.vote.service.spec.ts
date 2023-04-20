import { Test, TestingModule } from '@nestjs/testing';
import { TYPES } from '../interfaces/types';
import * as Cards from 'src/modules/cards/constants';
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
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';
import {
	GET_BOARD_USER_SERVICE,
	UPDATE_BOARD_USER_SERVICE
} from 'src/modules/boardUsers/constants';

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
					provide: GET_BOARD_USER_SERVICE,
					useValue: createMock<GetBoardUserServiceInterface>()
				},
				{
					provide: UPDATE_BOARD_USER_SERVICE,
					useValue: createMock<UpdateBoardServiceInterface>()
				},
				{
					provide: Cards.TYPES.services.GetCardService,
					useValue: createMock<GetCardServiceInterface>()
				},
				{
					provide: GET_BOARD_SERVICE,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();
		voteService = module.get<DeleteVoteServiceInterface>(DeleteVoteService);
		voteRepositoryMock = module.get(TYPES.repositories.VoteRepository);
		getBoardServiceMock = module.get(GET_BOARD_SERVICE);
		getBoardUserServiceMock = module.get(GET_BOARD_USER_SERVICE);
		getCardServiceMock = module.get(Cards.TYPES.services.GetCardService);
		updateBoardUserServiceMock = module.get(UPDATE_BOARD_USER_SERVICE);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		getBoardServiceMock.getBoardById.mockResolvedValue(board);
		getCardServiceMock.getCardFromBoard.mockResolvedValue(card);
		getBoardUserServiceMock.getBoardUser.mockResolvedValue(boardUser);
		updateBoardUserServiceMock.updateVoteUser.mockResolvedValue({
			...boardUser,
			votesCount: undefined
		});
		voteRepositoryMock.removeVotesFromCardItem.mockResolvedValue(board);
		voteRepositoryMock.removeVotesFromCard.mockResolvedValue(board);
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

	describe('canUserDeleteVote', () => {
		it('should throw an error when function returns false', async () => {
			getBoardUserServiceMock.getBoardUser.mockResolvedValue(null);

			expect(
				async () =>
					await voteService.canUserDeleteVote(board._id, userId, 1, card._id, cardItem._id)
			).rejects.toThrow(DeleteFailedException);
		});
	});

	describe('verifyIfUserCanDeleteVote', () => {
		it('should throw an error when the function returns false', async () => {
			//if board is not found
			try {
				getBoardServiceMock.getBoardById.mockResolvedValueOnce(null);

				await voteService.verifyIfUserCanDeleteVote(board._id, userId, 1, card._id);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}

			// if boardUser is not found
			try {
				getBoardUserServiceMock.getBoardUser.mockResolvedValueOnce(null);

				await voteService.verifyIfUserCanDeleteVote(board._id, userId, 1, card._id, cardItem._id);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}

			//if card is not found
			try {
				getCardServiceMock.getCardFromBoard.mockResolvedValueOnce(null);

				await voteService.verifyIfUserCanDeleteVote(board._id, userId, 1, card._id, cardItem._id);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}

			//if the cardItem votes does't include the vote of the userId
			try {
				const cardItemResult: CardItem = { ...cardItem, votes: [boardUser._id] };
				const cardResult: Card = { ...card, items: [cardItemResult] };

				getCardServiceMock.getCardFromBoard.mockResolvedValueOnce(cardResult);

				await voteService.verifyIfUserCanDeleteVote(board._id, userId, 1, card._id, cardItem._id);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}

			//if the votes count of the boardUser is less than zero
			try {
				getBoardUserServiceMock.getBoardUser.mockResolvedValueOnce({ ...boardUser, votesCount: 1 });

				await voteService.verifyIfUserCanDeleteVote(board._id, userId, 2, card._id);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}
		});
	});

	describe('getCardItemFromBoard', () => {
		it('should throw an error if the function fails', async () => {
			try {
				getCardServiceMock.getCardFromBoard.mockResolvedValue({
					...card,
					items: [CardItemFactory.create()]
				});

				await voteService.getCardItemFromBoard(board._id, card._id, cardItem._id);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}
		});

		it('should return a cardItem', async () => {
			getCardServiceMock.getCardFromBoard.mockResolvedValue({
				...card,
				items: [cardItem]
			});
			expect(await voteService.getCardItemFromBoard(board._id, card._id, cardItem._id)).toEqual(
				cardItem
			);
		});
	});

	describe('getCardFromBoard', () => {
		it('should throw an error if the function fails', async () => {
			try {
				getCardServiceMock.getCardFromBoard.mockResolvedValue({
					...card,
					items: [CardItemFactory.create()]
				});

				await voteService.getCardFromBoard(board._id, card._id);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}
		});
	});

	describe('removeVotesFromCardItem', () => {
		it('should throw an error if voteRepository.removeVotesFromCardItem fails', async () => {
			try {
				voteRepositoryMock.removeVotesFromCardItem.mockResolvedValue(null);

				await voteService.removeVotesFromCardItem(
					board._id,
					cardItem._id,
					cardItem.votes as string[],
					card._id
				);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}
		});
	});

	describe('deleteCardVotesFromColumn', () => {
		it('should throw an error if commitTransaction fails', async () => {
			try {
				updateBoardUserServiceMock.commitTransaction.mockRejectedValueOnce(null);

				await voteService.deleteCardVotesFromColumn(board._id, [card]);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}
		});

		it('should throw an error if deleteVotesFromCard fails', async () => {
			try {
				updateBoardUserServiceMock.updateManyUserVotes.mockResolvedValueOnce(null);
				const cardItems = CardItemFactory.createMany(2);

				await voteService.deleteCardVotesFromColumn(
					board._id,
					CardFactory.createMany(2, () => ({ items: cardItems }))
				);
			} catch (ex) {
				expect(ex).toBeInstanceOf(DeleteFailedException);
			}
		});
	});
});

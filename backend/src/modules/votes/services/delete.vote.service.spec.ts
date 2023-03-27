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

const userId: string = faker.datatype.uuid();
const board: Board = BoardFactory.create({ maxVotes: 3 });
const boardUser: BoardUser = BoardUserFactory.create({ board: board._id, votesCount: 0 });
const card: Card = CardFactory.create();
const cardItem: CardItem = card.items[0];

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
		it('should throw an error when the board is not found on the canUserVote function', async () => {
			getBoardServiceMock.getBoardById.mockResolvedValue(null);

			expect(
				async () =>
					await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(DeleteFailedException);
		});

		it('should throw an error when the boardUser is not found on the canUserVote function', async () => {
			getBoardUserServiceMock.getBoardUser.mockResolvedValue(null);

			expect(
				async () =>
					await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(DeleteFailedException);
		});

		it('should throw an error when the card is not found on the canUserVote function', async () => {
			getCardServiceMock.getCardFromBoard.mockResolvedValue(null);

			expect(
				async () =>
					await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(DeleteFailedException);
		});

		it.only("should throw an error when the cardItem does't include the vote of the userId", async () => {
			expect(
				async () =>
					await voteService.deleteVoteFromCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(DeleteFailedException);
		});
	});
});

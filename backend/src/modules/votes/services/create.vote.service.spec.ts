import { Test, TestingModule } from '@nestjs/testing';
import { TYPES } from '../interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import CreateVoteService from './create.vote.service';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { UpdateBoardServiceInterface } from 'src/modules/boards/interfaces/services/update.board.service.interface';
import faker from '@faker-js/faker';
import Board from 'src/modules/boards/entities/board.schema';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { CardFactory } from 'src/libs/test-utils/mocks/factories/card-factory.mock';
import CardItem from 'src/modules/cards/entities/card.item.schema';
import Card from 'src/modules/cards/entities/card.schema';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { NotFoundException } from '@nestjs/common';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';

const userId: string = faker.datatype.uuid();
const board: Board = BoardFactory.create({ maxVotes: 3 });
const boardUser: BoardUser = BoardUserFactory.create({ board: board._id, votesCount: 0 });
const card: Card = CardFactory.create();
const cardItem: CardItem = card.items[0];

describe('CreateVoteService', () => {
	let voteService: CreateVoteServiceInterface;
	let voteRepositoryMock: DeepMocked<VoteRepositoryInterface>;
	let getBoardUserServiceMock: DeepMocked<GetBoardUserServiceInterface>;
	let getBoardServiceMock: DeepMocked<GetBoardServiceInterface>;
	let updateBoardUserServiceMock: DeepMocked<UpdateBoardUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateVoteService,
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
					provide: Boards.TYPES.services.GetBoardService,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();
		voteService = module.get<CreateVoteServiceInterface>(CreateVoteService);
		voteRepositoryMock = module.get(TYPES.repositories.VoteRepository);
		getBoardUserServiceMock = module.get(BoardUsers.TYPES.services.GetBoardUserService);
		getBoardServiceMock = module.get(Boards.TYPES.services.GetBoardService);
		updateBoardUserServiceMock = module.get(BoardUsers.TYPES.services.UpdateBoardUserService);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		getBoardServiceMock.getBoardById.mockResolvedValue(board);
		getBoardUserServiceMock.getBoardUser.mockResolvedValue(boardUser);
		updateBoardUserServiceMock.updateVoteUser.mockResolvedValue({ ...boardUser, votesCount: 1 });
		voteRepositoryMock.insertCardItemVote.mockResolvedValue(board);
		voteRepositoryMock.insertCardGroupVote.mockResolvedValue(board);
	});

	it('should be defined', () => {
		expect(voteService).toBeDefined();
	});

	describe('addVoteToCard', () => {
		it('should throw an error when the board is not found on the canUserVote function', async () => {
			getBoardServiceMock.getBoardById.mockResolvedValue(null);

			expect(
				async () => await voteService.addVoteToCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(NotFoundException);
		});

		it('should throw an error when the boardUser is not found on the canUserVote function', async () => {
			getBoardUserServiceMock.getBoardUser.mockResolvedValue(null);

			expect(
				async () => await voteService.addVoteToCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(InsertFailedException);
		});

		it("should throw an error when the boardUser can't vote", async () => {
			getBoardUserServiceMock.getBoardUser.mockResolvedValue({ ...boardUser, votesCount: 3 });

			expect(
				async () => await voteService.addVoteToCard(board._id, card._id, userId, cardItem._id, 3)
			).rejects.toThrow(InsertFailedException);
		});

		it('should throw an error when the updateBoardUserService.updateVoteUser fails', async () => {
			updateBoardUserServiceMock.updateVoteUser.mockResolvedValue(null);

			expect(
				async () => await voteService.addVoteToCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(InsertFailedException);
		});

		it('should throw an error when the voteRepository.insertCardItemVote fails', async () => {
			voteRepositoryMock.insertCardItemVote.mockResolvedValue(null);

			expect(
				async () => await voteService.addVoteToCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(InsertFailedException);
		});

		it('should throw an error when the voteRepository.insertCardItemVote fails, but should call the addVoteToCard again if retry count is < 5 and e.code is WRITE_LOCK_ERROR', async () => {
			try {
				voteRepositoryMock.insertCardItemVote.mockRejectedValue({ code: WRITE_LOCK_ERROR });
				await voteService.addVoteToCard(board._id, card._id, userId, cardItem._id, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(InsertFailedException);
			}
		});

		it('should call the updateBoardUserService.updateVoteUser and the voteRepository.insertCardItemVote when addVoteToCard function succeeds', async () => {
			await voteService.addVoteToCard(board._id, card._id, userId, cardItem._id, 1);

			expect(updateBoardUserServiceMock.updateVoteUser).toBeCalled();
			expect(voteRepositoryMock.insertCardItemVote).toBeCalled();
		});

		it('should throw an error when a commit transaction fails', async () => {
			// this will allow to return true on verifyIfUserCanVote when board doesn't have maxVotes defined
			const mockBoardWithoutMaxVotes: Board = { ...board, maxVotes: undefined };
			getBoardServiceMock.getBoardById.mockResolvedValueOnce(mockBoardWithoutMaxVotes);

			voteRepositoryMock.commitTransaction.mockRejectedValueOnce('Commit transaction failed');

			expect(
				async () => await voteService.addVoteToCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(InsertFailedException);
		});
	});

	describe('addVoteToCardGroup', () => {
		it('should throw an error when the voteRepository.insertCardGroupVote fails', async () => {
			voteRepositoryMock.insertCardGroupVote.mockResolvedValue(null);

			expect(
				async () => await voteService.addVoteToCardGroup(board._id, card._id, userId, 1)
			).rejects.toThrow(InsertFailedException);
		});

		it('should throw an error when the voteRepository.insertCardGroupVote fails, but should call the addVoteToCard again if retry count is < 5 and e.code is WRITE_LOCK_ERROR', async () => {
			try {
				voteRepositoryMock.insertCardGroupVote.mockRejectedValue({ code: WRITE_LOCK_ERROR });
				await voteService.addVoteToCardGroup(board._id, card._id, userId, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(InsertFailedException);
			}
		});

		it('should call the updateBoardUserService.updateVoteUser and the voteRepository.insertCardGroupVote when addVoteToCard addVoteToCardGroup succeeds', async () => {
			await voteService.addVoteToCardGroup(board._id, card._id, userId, 1);

			expect(updateBoardUserServiceMock.updateVoteUser).toBeCalled();
			expect(voteRepositoryMock.insertCardGroupVote).toBeCalled();
		});

		it('should throw an error when a commit transaction fails', async () => {
			voteRepositoryMock.commitTransaction.mockRejectedValueOnce('Commit transaction failed');

			expect(
				async () => await voteService.addVoteToCardGroup(board._id, card._id, userId, 1)
			).rejects.toThrow(InsertFailedException);
		});
	});
});

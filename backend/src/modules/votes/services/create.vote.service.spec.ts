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

const userId: string = faker.datatype.uuid();
const board: Board = BoardFactory.create({ maxVotes: 3 });
const boardUser: BoardUser = BoardUserFactory.create({ board: board._id, votesCount: 0 });
const card: Card = CardFactory.create();
const cardItem: CardItem = card.items[0];

describe('CreateVoteService', () => {
	let voteService: CreateVoteServiceInterface;
	//let voteRepositoryMock: DeepMocked<VoteRepositoryInterface>;
	let getBoardUserServiceMock: DeepMocked<GetBoardUserServiceInterface>;
	let getBoardServiceMock: DeepMocked<GetBoardServiceInterface>;

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
		//voteRepositoryMock = module.get(TYPES.repositories.VoteRepository);
		getBoardUserServiceMock = module.get(BoardUsers.TYPES.services.GetBoardUserService);
		getBoardServiceMock = module.get(Boards.TYPES.services.GetBoardService);

		getBoardServiceMock.getBoardById.mockResolvedValue(board);
		getBoardUserServiceMock.getBoardUser.mockResolvedValue(boardUser);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(voteService).toBeDefined();
	});

	describe('addVoteToCard', () => {
		it('should throw an error when the board is not found on the canUserVote function', async () => {
			getBoardServiceMock.getBoardById.mockResolvedValueOnce(null);

			expect(
				async () => await voteService.addVoteToCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(NotFoundException);
		});

		it('should throw an error when the boardUser is not found on the canUserVote function', async () => {
			getBoardUserServiceMock.getBoardUser.mockResolvedValueOnce(null);

			expect(
				async () => await voteService.addVoteToCard(board._id, card._id, userId, cardItem._id, 1)
			).rejects.toThrow(NotFoundException);
		});

		it("should throw an error when the boardUser can't vote", async () => {
			boardUser.votesCount = 3;
			getBoardUserServiceMock.getBoardUser.mockResolvedValue(boardUser);

			expect(
				async () => await voteService.addVoteToCard(board._id, card._id, userId, cardItem._id, 3)
			).rejects.toThrow(InsertFailedException);
		});
	});
});

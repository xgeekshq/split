import { Test, TestingModule } from '@nestjs/testing';
import { VOTE_REPOSITORY } from '../constants';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import CreateVoteService from './create.vote.service';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { UpdateBoardServiceInterface } from 'src/modules/boards/interfaces/services/update.board.service.interface';
import { faker } from '@faker-js/faker';
import Board from 'src/modules/boards/entities/board.schema';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { NotFoundException } from '@nestjs/common';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';
import {
	GET_BOARD_USER_SERVICE,
	UPDATE_BOARD_USER_SERVICE
} from 'src/modules/boardUsers/constants';

const userId: string = faker.string.uuid();
const board: Board = BoardFactory.create({ maxVotes: 3 });
const boardUser: BoardUser = BoardUserFactory.create({ board: board._id, votesCount: 0 });

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
					provide: VOTE_REPOSITORY,
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
					provide: GET_BOARD_SERVICE,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();
		voteService = module.get(CreateVoteService);
		voteRepositoryMock = module.get(VOTE_REPOSITORY);
		getBoardUserServiceMock = module.get(GET_BOARD_USER_SERVICE);
		getBoardServiceMock = module.get(GET_BOARD_SERVICE);
		updateBoardUserServiceMock = module.get(UPDATE_BOARD_USER_SERVICE);
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

	describe('canUserVote', () => {
		it('should throw an error when the returned value is false', async () => {
			//if the board is not found
			try {
				getBoardServiceMock.getBoardById.mockResolvedValueOnce(null);
				await voteService.canUserVote(board._id, userId, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(NotFoundException);
			}

			//if the boardUser is not found
			try {
				getBoardUserServiceMock.getBoardUser.mockResolvedValueOnce(null);
				await voteService.canUserVote(board._id, userId, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(InsertFailedException);
			}

			//if count of total votes of the user is greater than the max votes of the board
			try {
				getBoardUserServiceMock.getBoardUser.mockResolvedValueOnce({ ...boardUser, votesCount: 3 });
				await voteService.canUserVote(board._id, userId, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(InsertFailedException);
			}
		});

		it('should return if user can vote', async () => {
			const boardWithoutMaxVotes: Board = { ...board, maxVotes: null };

			getBoardServiceMock.getBoardById.mockResolvedValue(boardWithoutMaxVotes);

			await voteService.canUserVote(boardWithoutMaxVotes._id, userId, 1);

			expect(getBoardServiceMock.getBoardById).toBeCalledTimes(1);
		});
	});

	describe('incrementVoteUser', () => {
		it('should throw an error when updateBoardUserServiceMock.updateVoteUser fails', async () => {
			try {
				updateBoardUserServiceMock.updateVoteUser.mockResolvedValueOnce(null);
				await voteService.incrementVoteUser(board._id, userId, 1);
			} catch (ex) {
				expect(ex).toBeInstanceOf(UpdateFailedException);
			}
		});
	});
});

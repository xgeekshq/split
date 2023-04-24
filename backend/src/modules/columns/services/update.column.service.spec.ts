import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { createMock } from '@golevelup/ts-jest';
import { EventEmitterModule } from '@nestjs/event-emitter';
import faker from '@faker-js/faker';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { ColumnRepository } from '../repositories/column.repository';
import GetBoardService from 'src/modules/boards/services/get.board.service';
import UpdateColumnService from './update.column.service';
import DeleteVoteService from 'src/modules/votes/services/delete.vote.service';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';
import { DELETE_VOTE_SERVICE } from 'src/modules/votes/constants';
import { COLUMN_REPOSITORY } from 'src/modules/columns/constants';

const fakeBoards = BoardFactory.createMany(2);

describe('UpdateColumnService', () => {
	let columnService: UpdateColumnService;
	let deleteVoteService: DeleteVoteService;
	let repositoryColumn: ColumnRepository;
	let socketService: SocketGateway;
	let getBoardServiceImpl: GetBoardService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [EventEmitterModule.forRoot()],
			providers: [
				UpdateColumnService,
				{
					provide: COLUMN_REPOSITORY,
					useValue: createMock<ColumnRepository>()
				},
				{
					provide: SocketGateway,
					useValue: createMock<SocketGateway>()
				},
				{
					provide: DELETE_VOTE_SERVICE,
					useValue: createMock<DeleteVoteServiceInterface>()
				},
				{
					provide: GET_BOARD_SERVICE,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();

		columnService = module.get(UpdateColumnService);
		deleteVoteService = module.get(DELETE_VOTE_SERVICE);
		repositoryColumn = module.get(COLUMN_REPOSITORY);
		socketService = module.get(SocketGateway);
		getBoardServiceImpl = module.get(GET_BOARD_SERVICE);

		jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(columnService).toBeDefined();
	});

	describe('delete cards from column', () => {
		it('should return a updated board without cards on the column', async () => {
			const fakeBoards = BoardFactory.createMany(2);
			const boardId = fakeBoards[1]._id;
			const boardResult = fakeBoards[1];
			const columnsResult = fakeBoards[1].columns.map((col) => {
				if (col._id === fakeBoards[1].columns[0]._id) {
					return { ...col, cards: [] };
				}

				return col;
			});

			const boardUpdateResult = { ...fakeBoards[1], columns: columnsResult };
			const columnToDeleteCards = {
				id: fakeBoards.find((board) => board._id === boardId).columns[0]._id,
				socketId: faker.datatype.uuid()
			};

			const spyGetBoardService = jest
				.spyOn(getBoardServiceImpl, 'getBoardById')
				.mockResolvedValue(
					boardResult as unknown as ReturnType<typeof getBoardServiceImpl.getBoardById>
				);
			const board = await getBoardServiceImpl.getBoardById(boardId);

			expect(spyGetBoardService).toHaveBeenCalledWith(boardId);
			expect(spyGetBoardService).toBeCalledTimes(1);
			expect(board).toEqual(boardResult);

			//test if board is updated
			const spyColumnRepository = jest
				.spyOn(repositoryColumn, 'deleteCards')
				.mockResolvedValue(
					boardUpdateResult as unknown as ReturnType<typeof getBoardServiceImpl.getBoardById>
				);

			jest.spyOn(deleteVoteService, 'deleteCardVotesFromColumn').mockResolvedValue(null);
			jest.spyOn(socketService, 'sendUpdatedBoard').mockReturnValue(null);

			const updateBoard = await columnService.deleteCardsFromColumn(boardId, columnToDeleteCards);

			expect(spyColumnRepository).toHaveBeenCalledWith(boardId, columnToDeleteCards.id);
			expect(spyColumnRepository).toBeCalledTimes(1);
			expect(updateBoard).toEqual(boardUpdateResult);
		});

		it('when not existing board, throw Bad Request Exception', async () => {
			const boardId = '-1';
			const columnToDeleteCards = {
				id: fakeBoards[0].columns[0]._id,
				socketId: faker.datatype.uuid()
			};

			const spyGetBoardService = jest
				.spyOn(getBoardServiceImpl, 'getBoardById')
				.mockResolvedValue(null);

			expect(async () => {
				return await columnService.deleteCardsFromColumn(boardId, columnToDeleteCards);
			}).rejects.toThrow(BadRequestException);

			expect(spyGetBoardService).toHaveBeenCalledWith(boardId);
			expect(spyGetBoardService).toHaveBeenCalledTimes(1);
		});

		it("when given column_id doesn't exist, throw Bad Request Exception", async () => {
			const fakeBoards = BoardFactory.createMany(2);
			const boardId = fakeBoards[1]._id;
			const columnToDeleteCards = {
				id: faker.datatype.uuid(),
				socketId: faker.datatype.uuid()
			};

			const spyGetBoardService = jest
				.spyOn(getBoardServiceImpl, 'getBoardById')
				.mockResolvedValue(
					fakeBoards.find((board) => boardId === board._id) as unknown as ReturnType<
						typeof getBoardServiceImpl.getBoardById
					>
				);

			expect(async () => {
				return await columnService.deleteCardsFromColumn(boardId, columnToDeleteCards);
			}).rejects.toThrow(NotFoundException);

			expect(spyGetBoardService).toHaveBeenCalledWith(boardId);
			expect(spyGetBoardService).toHaveBeenCalledTimes(1);
		});

		it("when board returned after deleting column cards doesn't exist, throw Bad Request Exception", async () => {
			const boardId = fakeBoards[0]._id;
			const columnToDeleteCards = {
				id: fakeBoards[0].columns[0]._id,
				socketId: faker.datatype.uuid()
			};

			const spyGetBoardService = jest
				.spyOn(getBoardServiceImpl, 'getBoardById')
				.mockResolvedValue(
					fakeBoards.find((board) => boardId === board._id) as unknown as ReturnType<
						typeof getBoardServiceImpl.getBoardById
					>
				);

			const spyColumnRepository = jest
				.spyOn(repositoryColumn, 'deleteCards')
				.mockResolvedValueOnce(null);

			try {
				await columnService.deleteCardsFromColumn(boardId, columnToDeleteCards);
			} catch (ex) {
				expect(ex).toBeInstanceOf(BadRequestException);

				expect(spyGetBoardService).toHaveBeenCalledWith(boardId);
				expect(spyColumnRepository).toHaveBeenCalledTimes(1);
			}
		});
	});
});

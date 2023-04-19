import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { createMock } from '@golevelup/ts-jest';
import { EventEmitterModule } from '@nestjs/event-emitter';
import faker from '@faker-js/faker';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { updateColumnService } from '../columns.providers';
import * as Columns from '../interfaces/types';
import * as Boards from 'src/modules/boards/types';
import * as Votes from 'src/modules/votes/interfaces/types';
import { ColumnRepository } from '../repositories/column.repository';
import GetBoardService from 'src/modules/boards/services/get.board.service';
import UpdateColumnService from './update.column.service';
import DeleteVoteService from 'src/modules/votes/services/delete.vote.service';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';

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
				updateColumnService,
				{
					provide: Columns.TYPES.repositories.ColumnRepository,
					useValue: createMock<ColumnRepository>()
				},
				{
					provide: SocketGateway,
					useValue: createMock<SocketGateway>()
				},
				{
					provide: Votes.TYPES.services.DeleteVoteService,
					useValue: createMock<DeleteVoteServiceInterface>()
				},
				{
					provide: Boards.TYPES.services.GetBoardService,
					useValue: createMock<GetBoardServiceInterface>()
				}
			]
		}).compile();

		columnService = module.get<UpdateColumnService>(Columns.TYPES.services.UpdateColumnService);
		deleteVoteService = module.get<DeleteVoteService>(Votes.TYPES.services.DeleteVoteService);
		repositoryColumn = module.get<ColumnRepository>(Columns.TYPES.repositories.ColumnRepository);
		socketService = module.get<SocketGateway>(SocketGateway);
		getBoardServiceImpl = module.get<GetBoardService>(Boards.TYPES.services.GetBoardService);

		jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(columnService).toBeDefined();
	});

	describe('update column', () => {
		it('should update a column and return an updated board', async () => {
			const fakeBoards = BoardFactory.createMany(2);
			const boardId = fakeBoards[1]._id;

			const column = {
				title: 'ola',
				_id: fakeBoards[1].columns[0]._id,
				cardText: fakeBoards[1].columns[0].cardText,
				color: fakeBoards[1].columns[0].color,
				isDefaultText: fakeBoards[1].columns[0].isDefaultText
			};

			const fakeResult = {
				...fakeBoards[1],
				columns: [
					{ ...fakeBoards[1].columns[0], title: column.title },
					{ ...fakeBoards[1].columns[1] }
				]
			};

			const spyColumnRepository = jest
				.spyOn(repositoryColumn, 'updateColumn')
				.mockResolvedValue(
					fakeResult as unknown as ReturnType<typeof repositoryColumn.updateColumn>
				);

			const result = await columnService.updateColumn(boardId, column);

			expect(spyColumnRepository).toHaveBeenCalledWith(boardId, column);

			expect(result).toEqual(fakeResult);
		});

		it('when not existing board, throw Bad Request Exception', async () => {
			const boardId = '-1';

			const column = {
				title: faker.lorem.words(2),
				_id: fakeBoards[1].columns[0]._id,
				cardText: fakeBoards[1].columns[0].cardText,
				color: fakeBoards[1].columns[0].color,
				isDefaultText: fakeBoards[1].columns[0].isDefaultText
			};

			const spyColumnRepository = jest
				.spyOn(repositoryColumn, 'updateColumn')
				.mockResolvedValue(null);

			expect(async () => {
				return await columnService.updateColumn(boardId, column);
			}).rejects.toThrow(BadRequestException);

			expect(spyColumnRepository).toHaveBeenCalledWith(boardId, column);
			expect(spyColumnRepository).toHaveBeenCalledTimes(1);
		});
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

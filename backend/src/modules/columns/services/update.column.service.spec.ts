import faker from '@faker-js/faker';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { boardRepository } from 'src/modules/boards/boards.providers';
import Board from 'src/modules/boards/entities/board.schema';
import { BoardRepository } from 'src/modules/boards/repositories/board.repository';
import { deleteCardService, getCardService } from 'src/modules/cards/cards.providers';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { deleteVoteService } from 'src/modules/votes/votes.providers';
import { columnRepository, updateColumnService } from '../columns.providers';
import * as Columns from '../interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as Cards from 'src/modules/cards/interfaces/types';
import { ColumnRepository } from '../repositories/column.repository';
import UpdateColumnServiceImpl from './update.column.service';
import DeleteCardServiceImpl from 'src/modules/cards/services/delete.card.service';

const fakeBoards = BoardFactory.createMany(2, 3, 2);

describe('UpdateColumnService', () => {
	let columnService: UpdateColumnServiceImpl;
	let deleteCardServiceImpl: DeleteCardServiceImpl;
	let repositoryColumn: ColumnRepository;
	let repositoryBoard: BoardRepository;
	let socketService: SocketGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateColumnServiceImpl,
				DeleteCardServiceImpl,
				SocketGateway,
				updateColumnService,
				deleteCardService,
				getCardService,
				deleteVoteService,
				columnRepository,
				boardRepository,
				{
					provide: getModelToken(Board.name),
					useValue: {}
				},
				{
					provide: getModelToken('BoardUser'),
					useValue: {}
				}
			]
		}).compile();

		columnService = module.get<UpdateColumnServiceImpl>(Columns.TYPES.services.UpdateColumnService);
		deleteCardServiceImpl = module.get<DeleteCardServiceImpl>(
			Cards.TYPES.services.DeleteCardService
		);
		repositoryColumn = module.get<ColumnRepository>(Columns.TYPES.repositories.ColumnRepository);
		repositoryBoard = module.get<BoardRepository>(Boards.TYPES.repositories.BoardRepository);
		socketService = module.get<SocketGateway>(SocketGateway);

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
			const fakeBoards = BoardFactory.createMany(2, 3, 2);
			const boardId = fakeBoards[1]._id;
			const boardResult = fakeBoards[1];
			const boardUpdateResult = { ...fakeBoards[1], cards: [] };
			const columnToDeleteCards = {
				id: fakeBoards.find((board) => board._id === boardId).columns[0]._id,
				socketId: faker.datatype.uuid()
			};

			//tests if board is found
			const spyBoardRepository = jest
				.spyOn(repositoryBoard, 'getBoard')
				.mockResolvedValue(boardResult as unknown as ReturnType<typeof repositoryBoard.getBoard>);

			const board = await repositoryBoard.getBoard(boardId);

			expect(spyBoardRepository).toHaveBeenCalledWith(boardId);
			expect(board).toEqual(boardResult);

			//test if board is updated
			const spyColumnRepository = jest
				.spyOn(repositoryColumn, 'deleteCards')
				.mockResolvedValue(
					boardUpdateResult as unknown as ReturnType<typeof repositoryColumn.updateColumn>
				);

			jest.spyOn(deleteCardServiceImpl, 'deleteCardVotesFromColumn').mockResolvedValue(null);
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

			const spyBoardRepository = jest.spyOn(repositoryBoard, 'getBoard').mockResolvedValue(null);

			expect(async () => {
				return await columnService.deleteCardsFromColumn(boardId, columnToDeleteCards);
			}).rejects.toThrow(BadRequestException);

			expect(spyBoardRepository).toHaveBeenCalledWith(boardId);
			expect(spyBoardRepository).toHaveBeenCalledTimes(1);
		});

		it("when given column_id doesn't exist, throw Bad Request Exception", async () => {
			const fakeBoards = BoardFactory.createMany(2, 0, 0);
			const boardId = fakeBoards[1]._id;
			const columnToDeleteCards = {
				id: faker.datatype.uuid(),
				socketId: faker.datatype.uuid()
			};

			const spyBoardRepository = jest
				.spyOn(repositoryBoard, 'getBoard')
				.mockResolvedValue(
					fakeBoards.find((board) => boardId === board._id) as unknown as ReturnType<
						typeof repositoryBoard.getBoard
					>
				);

			expect(async () => {
				return await columnService.deleteCardsFromColumn(boardId, columnToDeleteCards);
			}).rejects.toThrow(NotFoundException);

			expect(spyBoardRepository).toHaveBeenCalledWith(boardId);
			expect(spyBoardRepository).toHaveBeenCalledTimes(1);
		});

		it("when board returned after deleting column cards doesn't exist, throw Bad Request Exception", async () => {
			const boardId = fakeBoards[0]._id;
			const columnToDeleteCards = {
				id: fakeBoards[0].columns[0]._id,
				socketId: faker.datatype.uuid()
			};

			const spyBoardRepository = jest
				.spyOn(repositoryBoard, 'getBoard')
				.mockResolvedValue(
					fakeBoards.find((board) => boardId === board._id) as unknown as ReturnType<
						typeof repositoryBoard.getBoard
					>
				);

			const spyColumnRepository = jest
				.spyOn(repositoryColumn, 'deleteCards')
				.mockResolvedValueOnce(null);

			try {
				await columnService.deleteCardsFromColumn(boardId, columnToDeleteCards);
			} catch (ex) {
				expect(ex).toBeInstanceOf(BadRequestException);

				expect(spyBoardRepository).toHaveBeenCalledWith(boardId);
				expect(spyColumnRepository).toHaveBeenCalledTimes(1);
			}
		});
	});
});

import { ConfigService } from '@nestjs/config';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import jwtService from 'src/libs/test-utils/mocks/jwtService.mock';
import { getTokenAuthService } from 'src/modules/auth/auth.providers';
import { createBoardUserService } from './../../boards/boards.providers';
import { EventEmitterModule } from '@nestjs/event-emitter';
import faker from '@faker-js/faker';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import {
	boardRepository,
	boardUserRepository,
	getBoardService
} from 'src/modules/boards/boards.providers';
import Board from 'src/modules/boards/entities/board.schema';
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
import GetBoardServiceImpl from 'src/modules/boards/services/get.board.service';
import { getTeamService, teamRepository, teamUserRepository } from 'src/modules/teams/providers';
import { updateUserService, userRepository } from 'src/modules/users/users.providers';
import { JwtService } from '@nestjs/jwt';

const fakeBoards = BoardFactory.createMany(2);

describe('UpdateColumnService', () => {
	let columnService: UpdateColumnServiceImpl;
	let deleteCardServiceImpl: DeleteCardServiceImpl;
	let repositoryColumn: ColumnRepository;
	let socketService: SocketGateway;
	let getBoardServiceImpl: GetBoardServiceImpl;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [EventEmitterModule.forRoot()],
			providers: [
				UpdateColumnServiceImpl,
				DeleteCardServiceImpl,
				SocketGateway,
				GetBoardServiceImpl,
				getTeamService,
				updateColumnService,
				deleteCardService,
				getBoardService,
				getCardService,
				deleteVoteService,
				columnRepository,
				userRepository,
				boardRepository,
				boardUserRepository,
				teamRepository,
				teamUserRepository,
				createBoardUserService,
				getTokenAuthService,
				updateUserService,
				{
					provide: getModelToken(Board.name),
					useValue: {}
				},
				{
					provide: getModelToken('BoardUser'),
					useValue: {}
				},
				{
					provide: getModelToken('User'),
					useValue: {}
				},
				{
					provide: getModelToken('Team'),
					useValue: {}
				},
				{
					provide: getModelToken('TeamUser'),
					useValue: {}
				},
				{
					provide: getModelToken('ResetPassword'),
					useValue: {}
				},
				{
					provide: JwtService,
					useValue: jwtService
				},
				{
					provide: ConfigService,
					useValue: configService
				}
			]
		}).compile();

		columnService = module.get<UpdateColumnServiceImpl>(Columns.TYPES.services.UpdateColumnService);
		deleteCardServiceImpl = module.get<DeleteCardServiceImpl>(
			Cards.TYPES.services.DeleteCardService
		);
		repositoryColumn = module.get<ColumnRepository>(Columns.TYPES.repositories.ColumnRepository);
		socketService = module.get<SocketGateway>(SocketGateway);
		getBoardServiceImpl = module.get<GetBoardServiceImpl>(Boards.TYPES.services.GetBoardService);

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

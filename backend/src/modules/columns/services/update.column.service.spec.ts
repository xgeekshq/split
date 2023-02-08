import faker from '@faker-js/faker';
import { BadRequestException, Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import Board from 'src/modules/boards/entities/board.schema';
import { deleteCardService, getCardService } from 'src/modules/cards/cards.providers';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { deleteVoteService } from 'src/modules/votes/votes.providers';
import { columnRepository, updateColumnService } from '../columns.providers';
import { TYPES } from '../interfaces/types';
import { ColumnRepository } from '../repositories/column.repository';
import UpdateColumnServiceImpl from './update.column.service';

describe('UpdateColumnService', () => {
	let columnService: UpdateColumnServiceImpl;
	let repositoryColumn: ColumnRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				deleteCardService,
				updateColumnService,
				getCardService,
				deleteVoteService,
				columnRepository,
				SocketGateway,
				{
					provide: getModelToken(Board.name),
					useValue: {}
				},
				{
					provide: getModelToken('BoardUser'),
					useValue: {}
				},
				UpdateColumnServiceImpl
			]
		}).compile();

		columnService = module.get<UpdateColumnServiceImpl>(TYPES.services.UpdateColumnService);
		repositoryColumn = module.get<ColumnRepository>(TYPES.repositories.ColumnRepository);
		jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
	});

	it('should be defined', () => {
		expect(columnService).toBeDefined();
	});

	describe('should update column', () => {
		it('should update a column and returns an updated board', async () => {
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
			const fakeBoards = BoardFactory.createMany(2);

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
});

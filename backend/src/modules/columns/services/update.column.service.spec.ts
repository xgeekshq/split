import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document, LeanDocument, Model } from 'mongoose';
import { BoardFactoryMock } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import Board from 'src/modules/boards/entities/board.schema';
import { deleteCardService, getCardService } from 'src/modules/cards/cards.providers';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { deleteVoteService } from 'src/modules/votes/votes.providers';
import { columnRepository, updateColumnService } from '../columns.providers';
import UpdateColumnServiceImpl from './update.column.service';

const fakeBoards = BoardFactoryMock.createMany(2) as unknown as LeanDocument<
	Board & Document<any, any, any> & { _id: any }
>;

describe('UpdateColumnService', () => {
	let columnService: UpdateColumnServiceImpl;
	//let mockRepository: ColumnRepository;

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
					useValue: Model
				},
				{
					provide: getModelToken('BoardUser'),
					useValue: {}
				},
				UpdateColumnServiceImpl
			]
		}).compile();

		columnService = module.get<UpdateColumnServiceImpl>(UpdateColumnServiceImpl);
		//mockRepository = module.get<ColumnRepository>(ColumnRepository);
		jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
	});

	it('should be defined', () => {
		expect(columnService).toBeDefined();
	});

	it('should update a column and returns an updated board', async () => {
		const boardId = fakeBoards[1]._id;

		const column = {
			title: 'name',
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

		const updateColumn = jest.spyOn(columnService, 'updateColumn').mockResolvedValue(fakeBoards);

		await columnService.updateColumn(boardId, column);

		expect(updateColumn).toHaveBeenCalledWith(fakeResult);
	});
});

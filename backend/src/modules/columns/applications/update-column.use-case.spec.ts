import { Test, TestingModule } from '@nestjs/testing';
import { COLUMN_REPOSITORY } from '../constants';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { BadRequestException } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UpdateColumnUseCaseDto } from 'src/modules/columns/dto/useCase/update-column.use-case.dto';
import Board from 'src/modules/boards/entities/board.schema';
import { UpdateColumnUseCase } from 'src/modules/columns/applications/update-column.use-case';
import { ColumnRepositoryInterface } from 'src/modules/columns/repositories/column.repository.interface';
import { UpdateColumnDto } from 'src/modules/columns/dto/update-column.dto';
import { faker } from '@faker-js/faker';

const board = BoardFactory.create();
const boardId = board._id;

const column: UpdateColumnDto = {
	title: 'ola',
	_id: board.columns[0]._id,
	cardText: board.columns[0].cardText,
	color: board.columns[0].color,
	isDefaultText: board.columns[0].isDefaultText,
	socketId: faker.string.uuid()
};

const updateResult = {
	...board,
	columns: [{ ...board.columns[0], title: column.title }, { ...board.columns[1] }]
};

const completionHandler = () => {
	return;
};

describe('UpdateColumnUseCase', () => {
	let useCase: UseCase<UpdateColumnUseCaseDto, Board>;
	let columnRepositoryMock: DeepMocked<ColumnRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateColumnUseCase,
				{
					provide: COLUMN_REPOSITORY,
					useValue: createMock<ColumnRepositoryInterface>()
				}
			]
		}).compile();
		useCase = module.get(UpdateColumnUseCase);
		columnRepositoryMock = module.get(COLUMN_REPOSITORY);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('update column', () => {
		it('should update a column and return an updated board', async () => {
			columnRepositoryMock.updateColumn.mockResolvedValue(updateResult);

			const result = await useCase.execute({ boardId, columnData: column, completionHandler });

			expect(columnRepositoryMock.updateColumn).toHaveBeenCalledTimes(1);

			expect(result).toEqual(updateResult);
		});

		it('throw an error when column repository returns undefined ', async () => {
			const boardId = '-1';

			columnRepositoryMock.updateColumn.mockResolvedValue(undefined);

			expect(async () => {
				return await useCase.execute({ boardId, columnData: column, completionHandler });
			}).rejects.toThrow(BadRequestException);
		});
	});
});

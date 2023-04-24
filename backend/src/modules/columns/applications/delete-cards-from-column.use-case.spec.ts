import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { EventEmitterModule } from '@nestjs/event-emitter';
import faker from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';
import { DELETE_VOTE_SERVICE } from 'src/modules/votes/constants';
import { COLUMN_REPOSITORY } from 'src/modules/columns/constants';
import { DeleteCardsFromColumnUseCase } from 'src/modules/columns/applications/delete-cards-from-column.use-case';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { DeleteCardsFromColumnUseCaseDto } from 'src/modules/columns/dto/useCase/delete-cards-from-column.use-case.dto';
import Board from 'src/modules/boards/entities/board.schema';
import { ColumnRepositoryInterface } from 'src/modules/columns/repositories/column.repository.interface';

const board = BoardFactory.create();
const columnToDeleteCards = {
	id: board.columns[0]._id,
	socketId: faker.datatype.uuid()
};

const boardId = board._id;

const completionHandler = () => {
	return;
};

describe('DeleteCardsFromColumnUseCase', () => {
	let useCase: UseCase<DeleteCardsFromColumnUseCaseDto, Board>;
	let deleteVoteServiceMock: DeepMocked<DeleteVoteServiceInterface>;
	let columnRepositoryMock: DeepMocked<ColumnRepositoryInterface>;
	let getBoardServiceMock: DeepMocked<GetBoardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [EventEmitterModule.forRoot()],
			providers: [
				DeleteCardsFromColumnUseCase,
				{
					provide: COLUMN_REPOSITORY,
					useValue: createMock<ColumnRepositoryInterface>()
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

		useCase = module.get(DeleteCardsFromColumnUseCase);
		deleteVoteServiceMock = module.get(DELETE_VOTE_SERVICE);
		columnRepositoryMock = module.get(COLUMN_REPOSITORY);
		getBoardServiceMock = module.get(GET_BOARD_SERVICE);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		getBoardServiceMock.getBoardById.mockResolvedValue(board);
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('delete cards from column', () => {
		it('should return a updated board without cards on the column', async () => {
			const columnsResult = board.columns.map((col) => {
				if (col._id === board.columns[0]._id) {
					return { ...col, cards: [] };
				}

				return col;
			});

			const boardUpdateResult = { ...board, columns: columnsResult };

			columnRepositoryMock.deleteCards.mockResolvedValue(boardUpdateResult);

			deleteVoteServiceMock.deleteCardVotesFromColumn.mockResolvedValue(null);

			const updateBoard = await useCase.execute({
				boardId,
				columnToDelete: columnToDeleteCards,
				completionHandler
			});

			expect(getBoardServiceMock.getBoardById).toBeCalledTimes(1);
			expect(columnRepositoryMock.deleteCards).toBeCalledTimes(1);
			expect(updateBoard).toEqual(boardUpdateResult);
		});

		it('when not existing board, throw Bad Request Exception', async () => {
			getBoardServiceMock.getBoardById.mockResolvedValue(null);

			expect(async () => {
				return await useCase.execute({
					boardId: '-1',
					columnToDelete: columnToDeleteCards,
					completionHandler
				});
			}).rejects.toThrow(BadRequestException);
		});

		it("when given column_id doesn't exist, throw Bad Request Exception", async () => {
			const columnToDeleteCardsWithFakeId = {
				id: faker.datatype.uuid(),
				socketId: faker.datatype.uuid()
			};

			expect(async () => {
				return await useCase.execute({
					boardId: '-1',
					columnToDelete: columnToDeleteCardsWithFakeId,
					completionHandler
				});
			}).rejects.toThrow(NotFoundException);
		});

		it("when board returned after deleting column cards doesn't exist, throw Bad Request Exception", async () => {
			columnRepositoryMock.deleteCards.mockResolvedValue(null);

			try {
				await useCase.execute({
					boardId,
					columnToDelete: columnToDeleteCards,
					completionHandler
				});
			} catch (ex) {
				expect(ex).toBeInstanceOf(BadRequestException);
			}
		});
	});
});

import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';
import { DELETE_VOTE_SERVICE } from 'src/modules/votes/constants';
import { COLUMN_REPOSITORY } from 'src/modules/columns/constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { DeleteCardsFromColumnUseCaseDto } from 'src/modules/columns/dto/useCase/delete-cards-from-column.use-case.dto';
import Board from 'src/modules/boards/entities/board.schema';
import { ColumnRepositoryInterface } from 'src/modules/columns/repositories/column.repository.interface';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { DeleteCardsFromColumnUseCase } from 'src/modules/columns/applications/delete-cards-from-column.use-case';

const board = BoardFactory.create();
const columnToDeleteCards = {
	id: board.columns[0]._id,
	socketId: faker.string.uuid()
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
		it('should return an updated board without cards on the column', async () => {
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

		it('throw an error when board does not exists', async () => {
			getBoardServiceMock.getBoardById.mockResolvedValue(null);

			expect(async () => {
				return await useCase.execute({
					boardId: '-1',
					columnToDelete: columnToDeleteCards,
					completionHandler
				});
			}).rejects.toThrow(NotFoundException);
		});

		it("throw an error, when given column_id doesn't exist, ", async () => {
			const columnToDeleteCardsWithFakeId = {
				id: faker.string.uuid(),
				socketId: faker.string.uuid()
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

			expect(async () => {
				return await useCase.execute({
					boardId,
					columnToDelete: columnToDeleteCards,
					completionHandler
				});
			}).rejects.toThrow(UpdateFailedException);
		});
	});
});

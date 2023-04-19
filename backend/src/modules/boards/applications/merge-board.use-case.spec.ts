import { Test, TestingModule } from '@nestjs/testing';
import * as Boards from 'src/modules/boards/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import faker from '@faker-js/faker';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import MergeBoardUseCaseDto from '../dto/useCase/merge-board.use-case.dto';
import Board from '../entities/board.schema';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import { boardRepository } from '../boards.providers';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { generateNewSubColumns } from '../utils/generate-subcolumns';
import { mergeCardsFromSubBoardColumnsIntoMainBoard } from '../utils/merge-cards-from-subboard';
import { MergeBoardUseCase } from './merge-board.use-case';

const userId = faker.datatype.uuid();
const subBoards = BoardFactory.createMany(2, [
	{ isSubBoard: true, boardNumber: 1, submitedByUser: userId, submitedAt: new Date() },
	{ isSubBoard: true, boardNumber: 2 }
]);

const splitBoardWithSlack: Board = BoardFactory.create({
	isSubBoard: false,
	slackEnable: true,
	slackChannelId: faker.datatype.uuid(),
	dividedBoards: subBoards
});
const subBoardUpdated = { ...subBoards[1], submitedByUser: userId, submitedAt: new Date() };
const newSubColumnsSubBoardNumberOne = generateNewSubColumns(subBoards[0]);
const newSubColumnsSubBoardNumberTwo = generateNewSubColumns(subBoardUpdated);
const mergeSubBoard = {
	...splitBoardWithSlack,
	columns: mergeCardsFromSubBoardColumnsIntoMainBoard(
		[...splitBoardWithSlack.columns],
		newSubColumnsSubBoardNumberOne
	)
};
const completionHandler = () => {
	return;
};

const boardResult = {
	...mergeSubBoard,
	columns: mergeCardsFromSubBoardColumnsIntoMainBoard(
		[...splitBoardWithSlack.columns],
		newSubColumnsSubBoardNumberTwo
	),
	dividedBoards: [subBoards[0], subBoardUpdated]
};

describe('MergeBoardUseCase', () => {
	let useCase: UseCase<MergeBoardUseCaseDto, Board>;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let slackCommunicationServiceMock: DeepMocked<CommunicationServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MergeBoardUseCase,
				{
					provide: boardRepository.provide,
					useValue: createMock<BoardRepositoryInterface>()
				},
				{
					provide: CommunicationsType.TYPES.services.SlackCommunicationService,
					useValue: createMock<CommunicationServiceInterface>()
				}
			]
		}).compile();

		useCase = module.get(MergeBoardUseCase);
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
		slackCommunicationServiceMock = module.get(
			CommunicationsType.TYPES.services.SlackCommunicationService
		);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();

		boardRepositoryMock.getBoard.mockResolvedValue(subBoards[1]);
		boardRepositoryMock.getBoardByQuery.mockResolvedValue(splitBoardWithSlack);
		boardRepositoryMock.updateMergedSubBoard.mockResolvedValue(subBoardUpdated);
		boardRepositoryMock.updateMergedBoard.mockResolvedValue(boardResult);
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		it('should throw an error when the subBoard, board or subBoard.submittedByUser are undefined', async () => {
			boardRepositoryMock.getBoard.mockResolvedValue(null);

			expect(
				async () => await useCase.execute({ subBoardId: '-1', userId, completionHandler })
			).rejects.toThrowError(NotFoundException);
		});

		it('should throw an error if the boardRepository.updateMergedSubBoard fails', async () => {
			boardRepositoryMock.updateMergedSubBoard.mockResolvedValue(null);

			expect(
				async () =>
					await useCase.execute({ subBoardId: subBoards[1]._id, userId, completionHandler })
			).rejects.toThrowError(UpdateFailedException);
		});

		it('should throw an error if the boardRepository.updateMergedBoard fails', async () => {
			boardRepositoryMock.updateMergedBoard.mockResolvedValue(null);

			expect(
				async () =>
					await useCase.execute({ subBoardId: subBoards[1]._id, userId, completionHandler })
			).rejects.toThrowError(UpdateFailedException);
		});

		it('should throw an error if the boardRepository.startTransaction fails', async () => {
			boardRepositoryMock.commitTransaction.mockRejectedValueOnce('some error');

			expect(
				async () =>
					await useCase.execute({ subBoardId: subBoards[1]._id, userId, completionHandler })
			).rejects.toThrowError(UpdateFailedException);
		});

		it('should call the slackCommunicationService.executeMergeBoardNotification if the board has slackChannelId and slackEnable', async () => {
			const subBoardsWithoutAllMerged = BoardFactory.createMany(2, [
				{ isSubBoard: true, boardNumber: 1 },
				{ isSubBoard: true, boardNumber: 2 }
			]);

			const splitBoard: Board = BoardFactory.create({
				isSubBoard: false,
				slackEnable: true,
				slackChannelId: faker.datatype.uuid(),
				dividedBoards: subBoardsWithoutAllMerged
			});
			const subBoardUpdatedResult = {
				...subBoardsWithoutAllMerged[1],
				submitedByUser: userId,
				submitedAt: new Date()
			};
			const newSubColumnsSubBoardOfSubBoardOne = generateNewSubColumns(
				subBoardsWithoutAllMerged[0]
			);
			const newSubColumnsSubBoardOfSubBoardTwo = generateNewSubColumns(subBoardUpdatedResult);
			const mergeSubBoard = {
				...splitBoard,
				columns: mergeCardsFromSubBoardColumnsIntoMainBoard(
					[...splitBoard.columns],
					newSubColumnsSubBoardOfSubBoardOne
				)
			};
			const completionHandler = () => {
				return;
			};

			const boardResult = {
				...mergeSubBoard,
				columns: mergeCardsFromSubBoardColumnsIntoMainBoard(
					[...splitBoard.columns],
					newSubColumnsSubBoardOfSubBoardTwo
				),
				dividedBoards: [subBoardsWithoutAllMerged[0], subBoardUpdatedResult]
			};

			boardRepositoryMock.getBoard.mockResolvedValue(subBoardsWithoutAllMerged[1]);
			boardRepositoryMock.getBoardByQuery.mockResolvedValue(splitBoard);
			boardRepositoryMock.updateMergedSubBoard.mockResolvedValue(subBoardUpdatedResult);
			boardRepositoryMock.updateMergedBoard.mockResolvedValue(boardResult);

			await useCase.execute({
				subBoardId: subBoardsWithoutAllMerged[1]._id,
				userId,
				completionHandler
			});

			expect(slackCommunicationServiceMock.executeMergeBoardNotification).toBeCalledTimes(1);
		});

		it('should return the merged board', async () => {
			const socketId = faker.datatype.uuid();

			const result = await useCase.execute({
				subBoardId: subBoards[1]._id,
				userId,
				completionHandler,
				socketId
			});

			expect(result).toEqual(boardResult);
		});
	});
});

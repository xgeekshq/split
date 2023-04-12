import { Test, TestingModule } from '@nestjs/testing';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as Votes from 'src/modules/votes/interfaces/types';
import { boardRepository } from '../boards.providers';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UpdateBoardDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/updateBoardDto-factory.mock';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { NotFoundException } from '@nestjs/common';
import {
	getBoardUserService,
	updateBoardUserService
} from 'src/modules/boardUsers/boardusers.providers';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import ColumnDto from 'src/modules/columns/dto/column.dto';
import faker from '@faker-js/faker';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { BoardUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardUserDto-factory.mock';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import User from 'src/modules/users/entities/user.schema';
import { generateNewSubColumns } from '../utils/generate-subcolumns';
import { mergeCardsFromSubBoardColumnsIntoMainBoard } from '../utils/merge-cards-from-subboard';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import DeleteVoteService from 'src/modules/votes/services/delete.vote.service';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import Board from '../entities/board.schema';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UpdateBoardUseCase } from './update-board.use-case';

const regularBoard = BoardFactory.create({ isSubBoard: false, dividedBoards: [] });
const userId = faker.datatype.uuid();
const updateBoardDto = UpdateBoardDtoFactory.create({ maxVotes: null });
const subBoards = BoardFactory.createMany(2, [
	{ isSubBoard: true, boardNumber: 1, submitedByUser: userId, submitedAt: new Date() },
	{ isSubBoard: true, boardNumber: 2 }
]);
const splitBoard: Board = BoardFactory.create({ isSubBoard: false, dividedBoards: subBoards });
const splitBoardWithSlack: Board = BoardFactory.create({
	isSubBoard: false,
	slackEnable: true,
	slackChannelId: faker.datatype.uuid(),
	dividedBoards: subBoards
});
const currentResponsible = BoardUserFactory.create({
	role: BoardRoles.RESPONSIBLE,
	board: splitBoardWithSlack._id
});
const boardUsersDto = BoardUserDtoFactory.createMany(3, [
	{ board: splitBoardWithSlack._id, role: BoardRoles.RESPONSIBLE },
	{
		board: splitBoardWithSlack._id,
		role: BoardRoles.MEMBER,
		user: currentResponsible.user as User,
		_id: String(currentResponsible._id)
	},
	{ board: splitBoardWithSlack._id, role: BoardRoles.MEMBER }
]);
const newResponsible = BoardUserFactory.create({
	board: splitBoardWithSlack._id,
	role: BoardRoles.RESPONSIBLE,
	user: UserFactory.create({ _id: (boardUsersDto[0].user as User)._id }),
	_id: String(boardUsersDto[0]._id)
});
const updateBoardDtoWithResponsible = UpdateBoardDtoFactory.create({
	responsible: newResponsible,
	mainBoardId: splitBoard._id,
	users: boardUsersDto,
	maxVotes: null,
	_id: splitBoardWithSlack._id,
	isSubBoard: true
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

const boardResult = {
	...mergeSubBoard,
	columns: mergeCardsFromSubBoardColumnsIntoMainBoard(
		[...splitBoardWithSlack.columns],
		newSubColumnsSubBoardNumberTwo
	),
	dividedBoards: [subBoards[0], subBoardUpdated]
};

describe('UpdateBoardUseCase', () => {
	let useCase: UseCase<UpdateBoardDto, Board>;
	let updateBoardUserServiceMock: DeepMocked<UpdateBoardUserServiceInterface>;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let getBoardUserServiceMock: DeepMocked<GetBoardUserServiceInterface>;
	let slackCommunicationServiceMock: DeepMocked<CommunicationServiceInterface>;
	let deleteVoteServiceMock: DeepMocked<DeleteVoteService>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateBoardUseCase,
				{
					provide: CommunicationsType.TYPES.services.SlackCommunicationService,
					useValue: createMock<CommunicationServiceInterface>()
				},
				{
					provide: Votes.TYPES.services.DeleteVoteService,
					useValue: createMock<DeleteVoteServiceInterface>()
				},
				{
					provide: getBoardUserService.provide,
					useValue: createMock<GetBoardUserServiceInterface>()
				},
				{
					provide: updateBoardUserService.provide,
					useValue: createMock<UpdateBoardUserServiceInterface>()
				},
				{
					provide: boardRepository.provide,
					useValue: createMock<BoardRepositoryInterface>()
				}
			]
		}).compile();

		useCase = module.get(UpdateBoardUseCase);
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
		updateBoardUserServiceMock = module.get(BoardUsers.TYPES.services.UpdateBoardUserService);
		getBoardUserServiceMock = module.get(BoardUsers.TYPES.services.GetBoardUserService);
		deleteVoteServiceMock = module.get(Votes.TYPES.services.DeleteVoteService);
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
		it('should throw an error if max votes is less than the highest votes on board', async () => {
			const updateBoardDtoWithMaxVotes: UpdateBoardDto = { ...updateBoardDto, maxVotes: 2 };
			const boardUsers = BoardUserFactory.createMany(2, [{ votesCount: 3 }, { votesCount: 1 }]);

			getBoardUserServiceMock.getVotesCount.mockResolvedValue(boardUsers);

			expect(async () => await useCase.execute(updateBoardDtoWithMaxVotes)).rejects.toThrow(
				UpdateFailedException
			);
		});

		it('should throw an error if board not found', async () => {
			boardRepositoryMock.getBoard.mockResolvedValue(null);
			expect(async () => await useCase.execute(updateBoardDto)).rejects.toThrow(NotFoundException);
		});

		it('should call the changeResponsibleOnBoard method if the current responsible is not equal to the new responsible', async () => {
			const updateBoardDtoWithSubBoardId: UpdateBoardDto = {
				...updateBoardDtoWithResponsible,
				boardId: subBoards[1]._id
			};
			//gets the current responsible from the board
			getBoardUserServiceMock.getBoardResponsible.mockResolvedValue(currentResponsible);

			await useCase.execute(updateBoardDtoWithSubBoardId);
			//update the changeResponsibleOnBoard
			expect(updateBoardUserServiceMock.updateBoardUserRole).toBeCalled();
		});

		it('should throw an error when update fails', async () => {
			boardRepositoryMock.updateBoard.mockResolvedValue(null);

			expect(async () => await useCase.execute(updateBoardDto)).rejects.toThrow(
				UpdateFailedException
			);
		});

		it('should call the slackCommunicationService.executeResponsibleChange if the board has a newResponsible and slack enable', async () => {
			const boardWithSlack: Board = {
				...subBoards[1],
				slackEnable: true,
				slackChannelId: faker.datatype.uuid()
			};

			const updateBoardDtoWithBoardWithSlack: UpdateBoardDto = {
				...updateBoardDtoWithResponsible,
				boardId: boardWithSlack._id
			};

			boardRepositoryMock.getBoard.mockResolvedValue(boardWithSlack);
			getBoardUserServiceMock.getBoardResponsible.mockResolvedValue(currentResponsible);
			boardRepositoryMock.updateBoard.mockResolvedValue(boardWithSlack);

			await useCase.execute(updateBoardDtoWithBoardWithSlack);

			expect(slackCommunicationServiceMock.executeResponsibleChange).toBeCalledTimes(1);
		});

		it('should update a split board', async () => {
			const boardWithAddedCards: Board = { ...subBoards[1], addCards: false };

			const updateBoardDtoWithBoardWithAddedCards = UpdateBoardDtoFactory.create({
				maxVotes: null,
				title: 'Mock 2.0',
				_id: boardWithAddedCards._id,
				addCards: true,
				boardId: boardWithAddedCards._id
			});
			const boardResult = {
				...boardWithAddedCards,
				title: updateBoardDtoWithBoardWithAddedCards.title
			};

			boardRepositoryMock.getBoard.mockResolvedValue(boardWithAddedCards);
			boardRepositoryMock.updateBoard.mockResolvedValue(boardResult);

			const result = await useCase.execute(updateBoardDtoWithBoardWithAddedCards);

			expect(result).toEqual(boardResult);
		});

		it('should update a regular board', async () => {
			const updateRegularBoard: Board = {
				...regularBoard,
				columns: [...regularBoard.columns, { ...regularBoard.columns[1], _id: null }]
			};

			updateRegularBoard.columns[1].title = 'Make things';
			updateRegularBoard.columns[1].color = '#FEB9A9';

			const updateRegularBoardDto = UpdateBoardDtoFactory.create({
				maxVotes: null,
				_id: updateRegularBoard._id,
				isSubBoard: false,
				dividedBoards: [],
				columns: updateRegularBoard.columns as ColumnDto[],
				deletedColumns: [updateRegularBoard.columns[0]._id],
				boardId: updateRegularBoard._id
			});

			boardRepositoryMock.getBoard.mockResolvedValue(updateRegularBoard);
			getBoardUserServiceMock.getBoardResponsible.mockResolvedValue(null);
			deleteVoteServiceMock.deleteCardVotesFromColumn.mockResolvedValue(null);

			const boardResult = { ...updateRegularBoard, columns: updateRegularBoard.columns.slice(1) };

			boardRepositoryMock.updateBoard.mockResolvedValue(boardResult);

			const result = await useCase.execute(updateRegularBoardDto);

			expect(result).toEqual(boardResult);
		});
	});
});

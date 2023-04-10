import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as Votes from 'src/modules/votes/interfaces/types';
import { updateBoardService } from './../boards.providers';
import { boardRepository } from '../boards.providers';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import { SendMessageServiceInterface } from 'src/modules/communication/interfaces/send-message.service.interface';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UpdateBoardDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/updateBoardDto-factory.mock';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { NotFoundException } from '@nestjs/common';
import {
	createBoardUserService,
	deleteBoardUserService,
	getBoardUserService,
	updateBoardUserService
} from 'src/modules/boardUsers/boardusers.providers';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { CreateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/create.board.user.service.interface';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/delete.board.user.service.interface';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import { SLACK_ENABLE, SLACK_MASTER_CHANNEL_ID } from 'src/libs/constants/slack';
import { FRONTEND_URL } from 'src/libs/constants/frontend';
import ColumnDto from 'src/modules/columns/dto/column.dto';
import faker from '@faker-js/faker';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { BoardUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardUserDto-factory.mock';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import User from 'src/modules/users/entities/user.schema';
import { generateNewSubColumns } from '../utils/generate-subcolumns';
import { mergeCardsFromSubBoardColumnsIntoMainBoard } from '../utils/merge-cards-from-subboard';
import { TeamCommunicationDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/teamDto-factory';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import DeleteVoteService from 'src/modules/votes/services/delete.vote.service';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import Board from '../entities/board.schema';
import { UpdateBoardDto } from '../dto/update-board.dto';

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
const newSubColumnsSubBoard_1 = generateNewSubColumns(subBoards[0]);
const newSubColumnsSubBoard_2 = generateNewSubColumns(subBoardUpdated);
const mergeSubBoard_1 = {
	...splitBoardWithSlack,
	columns: mergeCardsFromSubBoardColumnsIntoMainBoard(
		[...splitBoardWithSlack.columns],
		newSubColumnsSubBoard_1
	)
};

const boardResult = {
	...mergeSubBoard_1,
	columns: mergeCardsFromSubBoardColumnsIntoMainBoard(
		[...splitBoardWithSlack.columns],
		newSubColumnsSubBoard_2
	),
	dividedBoards: [subBoards[0], subBoardUpdated]
};

const addUsers = BoardUserDtoFactory.createMany(2);
const boardUserToRemove = BoardUserFactory.create();
const removedUsers = [boardUserToRemove._id];
const boardUserDto = BoardUserDtoFactory.create({ role: BoardRoles.MEMBER });

describe('UpdateBoardService', () => {
	let boardService: UpdateBoardServiceInterface;
	let updateBoardUserServiceMock: DeepMocked<UpdateBoardUserServiceInterface>;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let eventEmitterMock: DeepMocked<EventEmitter2>;
	let getBoardUserServiceMock: DeepMocked<GetBoardUserServiceInterface>;
	let configServiceMock: DeepMocked<ConfigService>;
	let slackSendMessageServiceMock: DeepMocked<SendMessageServiceInterface>;
	let slackCommunicationServiceMock: DeepMocked<CommunicationServiceInterface>;
	let deleteVoteServiceMock: DeepMocked<DeleteVoteService>;
	let createBoardUserServiceMock: DeepMocked<CreateBoardUserServiceInterface>;
	let deleteBoardUserServiceMock: DeepMocked<DeleteBoardUserServiceInterface>;

	let socketServiceMock: DeepMocked<SocketGateway>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				updateBoardService,
				{
					provide: CommunicationsType.TYPES.services.SlackSendMessageService,
					useValue: createMock<SendMessageServiceInterface>()
				},
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
					provide: createBoardUserService.provide,
					useValue: createMock<CreateBoardUserServiceInterface>()
				},
				{
					provide: updateBoardUserService.provide,
					useValue: createMock<UpdateBoardUserServiceInterface>()
				},
				{
					provide: deleteBoardUserService.provide,
					useValue: createMock<DeleteBoardUserServiceInterface>()
				},
				{
					provide: boardRepository.provide,
					useValue: createMock<BoardRepositoryInterface>()
				},
				{
					provide: SocketGateway,
					useValue: createMock<SocketGateway>()
				},
				{
					provide: EventEmitter2,
					useValue: createMock<EventEmitter2>()
				},
				{
					provide: ConfigService,
					useValue: createMock<ConfigService>()
				}
			]
		}).compile();

		boardService = module.get<UpdateBoardServiceInterface>(updateBoardService.provide);
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
		updateBoardUserServiceMock = module.get(BoardUsers.TYPES.services.UpdateBoardUserService);
		getBoardUserServiceMock = module.get(BoardUsers.TYPES.services.GetBoardUserService);
		deleteVoteServiceMock = module.get(Votes.TYPES.services.DeleteVoteService);
		eventEmitterMock = module.get(EventEmitter2);
		configServiceMock = module.get(ConfigService);
		slackSendMessageServiceMock = module.get(
			CommunicationsType.TYPES.services.SlackSendMessageService
		);
		slackCommunicationServiceMock = module.get(
			CommunicationsType.TYPES.services.SlackCommunicationService
		);
		socketServiceMock = module.get(SocketGateway);
		createBoardUserServiceMock = module.get(BoardUsers.TYPES.services.CreateBoardUserService);
		deleteBoardUserServiceMock = module.get(BoardUsers.TYPES.services.DeleteBoardUserService);
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
		expect(boardService).toBeDefined();
	});

	describe('update', () => {
		it('should throw an error if max votes is less than the highest votes on board', async () => {
			const updateBoardDto_1: UpdateBoardDto = { ...updateBoardDto, maxVotes: 2 };
			const boardUsers = BoardUserFactory.createMany(2, [{ votesCount: 3 }, { votesCount: 1 }]);

			jest.spyOn(getBoardUserServiceMock, 'getVotesCount').mockResolvedValue(boardUsers);

			expect(async () => await boardService.update('1', updateBoardDto_1)).rejects.toThrow(
				UpdateFailedException
			);
		});

		it('should throw an error if board not found', async () => {
			boardRepositoryMock.getBoard.mockResolvedValue(null);
			expect(async () => await boardService.update('-1', updateBoardDto)).rejects.toThrow(
				NotFoundException
			);
		});

		it('should call the changeResponsibleOnBoard method if the current responsible is not equal to the new responsible', async () => {
			//gets the current responsible from the board
			getBoardUserServiceMock.getBoardResponsible.mockResolvedValue(currentResponsible);

			await boardService.update(subBoards[1]._id, updateBoardDtoWithResponsible);
			//update the changeResponsibleOnBoard
			expect(updateBoardUserServiceMock.updateBoardUserRole).toBeCalled();
		});

		it('should throw an error when update fails', async () => {
			boardRepositoryMock.updateBoard.mockResolvedValue(null);

			expect(async () => await boardService.update('1', updateBoardDto)).rejects.toThrow(
				UpdateFailedException
			);
		});

		it('should call the socketService.sendUpdatedBoard if the socketId exists', async () => {
			const updateBoardDto_1 = UpdateBoardDtoFactory.create({
				maxVotes: null,
				title: 'Mock 2.0',
				_id: subBoards[1]._id,
				socketId: faker.datatype.uuid()
			});
			const boardResult = { ...subBoards[1], title: updateBoardDto_1.title };

			boardRepositoryMock.updateBoard.mockResolvedValue(boardResult);

			await boardService.update(subBoards[1]._id, updateBoardDto_1);

			expect(socketServiceMock.sendUpdatedBoard).toBeCalledTimes(1);
		});

		it('should call the slackCommunicationService.executeResponsibleChange if the board has a newResponsible and slack enable', async () => {
			const board_1: Board = {
				...subBoards[1],
				slackEnable: true,
				slackChannelId: faker.datatype.uuid()
			};

			boardRepositoryMock.getBoard.mockResolvedValue(board_1);
			boardRepositoryMock.updateBoard.mockResolvedValue(board_1);

			jest
				.spyOn(getBoardUserServiceMock, 'getBoardResponsible')
				.mockResolvedValue(currentResponsible);

			await boardService.update(board_1._id, updateBoardDtoWithResponsible);

			expect(slackCommunicationServiceMock.executeResponsibleChange).toBeCalledTimes(1);
		});

		it('should update a split board', async () => {
			const board_1: Board = { ...subBoards[1], addCards: false };

			const updateBoardDto_1 = UpdateBoardDtoFactory.create({
				maxVotes: null,
				title: 'Mock 2.0',
				_id: board_1._id,
				addCards: true
			});
			const boardResult = { ...board_1, title: updateBoardDto_1.title };

			boardRepositoryMock.getBoard.mockResolvedValue(board_1);
			boardRepositoryMock.updateBoard.mockResolvedValue(boardResult);

			const result = await boardService.update(board_1._id, updateBoardDto_1);

			expect(result).toEqual(boardResult);
		});

		it('should update a regular board', async () => {
			const board_1: Board = { ...regularBoard };

			board_1.columns[1].title = 'Make things';
			board_1.columns[1].color = '#FEB9A9';

			const updateBoardDto_1 = UpdateBoardDtoFactory.create({
				maxVotes: null,
				_id: board_1._id,
				isSubBoard: false,
				dividedBoards: [],
				columns: board_1.columns as ColumnDto[],
				deletedColumns: [board_1.columns[0]._id]
			});

			boardRepositoryMock.getBoard.mockResolvedValue(board_1);
			getBoardUserServiceMock.getBoardResponsible.mockResolvedValue(null);
			deleteVoteServiceMock.deleteCardVotesFromColumn.mockResolvedValue(null);

			const boardResult = { ...board_1, columns: board_1.columns.slice(1) };

			boardRepositoryMock.updateBoard.mockResolvedValue(boardResult);

			const result = await boardService.update(board_1._id, updateBoardDto_1);

			expect(result).toEqual(boardResult);
		});
	});

	describe('mergeBoards', () => {
		it('should throw an error when the subBoard, board or subBoard.submittedByUser are undefined', async () => {
			boardRepositoryMock.getBoard.mockResolvedValue(null);

			expect(async () => await boardService.mergeBoards('-1', userId)).rejects.toThrowError(
				NotFoundException
			);
		});

		it('should throw an error if the boardRepository.updateMergedSubBoard fails', async () => {
			boardRepositoryMock.updateMergedSubBoard.mockResolvedValue(null);

			expect(
				async () => await boardService.mergeBoards(subBoards[1]._id, userId)
			).rejects.toThrowError(UpdateFailedException);
		});

		it('should throw an error if the boardRepository.updateMergedBoard fails', async () => {
			boardRepositoryMock.updateMergedBoard.mockResolvedValue(null);

			expect(
				async () => await boardService.mergeBoards(subBoards[1]._id, userId)
			).rejects.toThrowError(UpdateFailedException);
		});

		it('should throw an error if the boardRepository.startTransaction fails', async () => {
			boardRepositoryMock.commitTransaction.mockRejectedValue('some error');

			expect(
				async () => await boardService.mergeBoards(subBoards[1]._id, userId)
			).rejects.toThrowError(UpdateFailedException);
		});

		it('should call the slackCommunicationService.executeMergeBoardNotification if the board has slackChannelId and slackEnable', async () => {
			boardRepositoryMock.commitTransaction.mockResolvedValue(null);

			await boardService.mergeBoards(subBoards[1]._id, userId);

			expect(slackCommunicationServiceMock.executeMergeBoardNotification).toBeCalledTimes(1);
		});

		it('should call the socketService.sendUpdatedAllBoard if there is a socketId', async () => {
			const socketId = faker.datatype.uuid();

			boardRepositoryMock.updateMergedSubBoard.mockResolvedValue(subBoards[1]);
			boardRepositoryMock.updateMergedBoard.mockResolvedValue(splitBoardWithSlack);
			boardRepositoryMock.commitTransaction.mockResolvedValue(null);

			await boardService.mergeBoards(subBoards[1]._id, userId, socketId);

			expect(socketServiceMock.sendUpdatedAllBoard).toBeCalledTimes(1);
		});

		it('should return the merged board', async () => {
			boardRepositoryMock.commitTransaction.mockResolvedValue(null);

			const result = await boardService.mergeBoards(subBoards[1]._id, userId);

			expect(result).toEqual(boardResult);
		});
	});

	describe('updateChannelId', () => {
		it('should call the boardRepository.updatedChannelId', async () => {
			const teamsDto = TeamCommunicationDtoFactory.createMany(2);

			boardRepositoryMock.updatedChannelId.mockResolvedValue(splitBoard);
			boardService.updateChannelId(teamsDto);

			expect(boardRepositoryMock.updatedChannelId).toBeCalledTimes(teamsDto.length);
		});
	});

	describe('updateBoardParticipants', () => {
		it('should throw an error when the inserting of board users fails', async () => {
			const removedUsers = [];

			createBoardUserServiceMock.saveBoardUsers.mockRejectedValueOnce('Error inserting users');
			expect(
				async () => await boardService.updateBoardParticipants(addUsers, removedUsers)
			).rejects.toThrowError(UpdateFailedException);
		});

		it('should throw an error when the deleting of board users fails', async () => {
			deleteBoardUserServiceMock.deleteBoardUsers.mockResolvedValueOnce(0);
			expect(
				async () => await boardService.updateBoardParticipants(addUsers, removedUsers)
			).rejects.toThrowError(UpdateFailedException);
		});

		it('should return the created boardUsers', async () => {
			const saveBoardUsersResult = BoardUserFactory.createMany(2, [
				{
					_id: addUsers[0]._id,
					role: addUsers[0].role,
					user: addUsers[0].user,
					board: addUsers[0].board
				},
				{
					_id: addUsers[1]._id,
					role: addUsers[1].role,
					user: addUsers[1].user,
					board: addUsers[1].board
				}
			]);

			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(saveBoardUsersResult);
			deleteBoardUserServiceMock.deleteBoardUsers.mockResolvedValueOnce(1);

			const boardUsersCreatedResult = await boardService.updateBoardParticipants(
				addUsers,
				removedUsers
			);
			expect(boardUsersCreatedResult).toEqual(saveBoardUsersResult);
		});
	});

	describe('updateBoardParticipantsRole', () => {
		it('should throw an error if the updateBoardUserRole fails', async () => {
			updateBoardUserServiceMock.updateBoardUserRole.mockResolvedValueOnce(null);

			expect(
				async () => await boardService.updateBoardParticipantsRole(boardUserDto)
			).rejects.toThrowError(UpdateFailedException);
		});

		it('should return the boardUser with the updated role', async () => {
			const boardUserUpdated = BoardUserFactory.create({
				_id: boardUserDto._id,
				role: BoardRoles.RESPONSIBLE,
				user: boardUserDto.user,
				board: boardUserDto.board
			});

			updateBoardUserServiceMock.updateBoardUserRole.mockResolvedValueOnce(boardUserUpdated);

			const boardUserResult = await boardService.updateBoardParticipantsRole(boardUserDto);

			expect(boardUserResult).toEqual(boardUserUpdated);
		});
	});

	describe('updatePhase', () => {
		it('should be defined', () => {
			expect(boardService.updatePhase).toBeDefined();
		});

		it('should call the boardRepository ', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };
			await boardService.updatePhase(boardPhaseDto);
			expect(boardRepositoryMock.updatePhase).toBeCalledTimes(1);
		});

		it('should throw the badRequestException when the boardRepository fails', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };
			// Set up the board repository mock to reject with an error
			boardRepositoryMock.updatePhase.mockRejectedValueOnce(new Error('Some error'));

			// Verify that the service method that is being tested throws a BadRequestException
			expect(async () => await boardService.updatePhase(boardPhaseDto)).rejects.toThrowError(
				UpdateFailedException
			);
		});

		it('should call the websocket with eventEmitter', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };
			// Call the service method being tested
			await boardService.updatePhase(boardPhaseDto);

			// Verify that the eventEmitterMock.emit method was called exactly once
			expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1);
		});

		it('should call the slackSendMessageService.execute once with slackMessageDto', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };
			// Create a fake board object with the specified properties
			const board = BoardFactory.create();
			board.team = TeamFactory.create({ name: 'xgeeks' });

			board.phase = BoardPhases.SUBMITTED;
			board.slackEnable = true;

			const table = {
				[SLACK_MASTER_CHANNEL_ID]: '6405f9a04633b1668f71c068',
				[SLACK_ENABLE]: true,
				[FRONTEND_URL]: 'https://split.kigroup.de/'
			};

			// Set up the board repository mock to resolve with the fake board object
			boardRepositoryMock.updatePhase.mockResolvedValue(board);

			// Set up the configuration service mock
			configServiceMock.getOrThrow.mockImplementation((key: string) => {
				return table[key];
			});

			// Call the service method being tested
			await boardService.updatePhase(boardPhaseDto);

			// Verify that the slackSendMessageService.execute method with correct data 1 time
			expect(slackSendMessageServiceMock.execute).toHaveBeenNthCalledWith(1, {
				slackChannelId: '6405f9a04633b1668f71c068',
				message: expect.stringContaining('https://split.kigroup.de/')
			});

			board.phase = BoardPhases.VOTINGPHASE;

			await boardService.updatePhase(boardPhaseDto);

			// Verify that the slackSendMessageService.execute method with correct data 1 time
			expect(slackSendMessageServiceMock.execute).toHaveBeenNthCalledWith(1, {
				slackChannelId: '6405f9a04633b1668f71c068',
				message: expect.stringContaining('https://split.kigroup.de/')
			});
		});
	});
});

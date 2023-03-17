import { updateBoardService } from './../boards.providers';
import { Test, TestingModule } from '@nestjs/testing';
import { getTeamService } from 'src/modules/teams/providers';
import { boardRepository } from '../boards.providers';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { DeleteCardServiceInterface } from 'src/modules/cards/interfaces/services/delete.card.service.interface';
import { deleteCardService } from 'src/modules/cards/cards.providers';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as Cards from 'src/modules/cards/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import { SendMessageServiceInterface } from 'src/modules/communication/interfaces/send-message.service.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UpdateBoardDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/updateBoardDto-factory.mock';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BoardUserRepositoryInterface } from 'src/modules/boardusers/interfaces/repositories/board-user.repository.interface';
import {
	boardUserRepository,
	createBoardUserService,
	deleteBoardUserService,
	getBoardUserService,
	updateBoardUserService
} from 'src/modules/boardusers/boardusers.providers';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardusers/interfaces/services/update.board.user.service.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardusers/interfaces/services/get.board.user.service.interface';
import { CreateBoardUserServiceInterface } from 'src/modules/boardusers/interfaces/services/create.board.user.service.interface';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardusers/interfaces/services/delete.board.user.service.interface';
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

describe('GetUpdateBoardService', () => {
	let boardService: UpdateBoardServiceInterface;
	let updateBoardUserServiceMock: DeepMocked<UpdateBoardUserServiceInterface>;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let eventEmitterMock: DeepMocked<EventEmitter2>;
	let getBoardUserServiceMock: DeepMocked<GetBoardUserServiceInterface>;
	let configServiceMock: DeepMocked<ConfigService>;
	let slackSendMessageServiceMock: DeepMocked<SendMessageServiceInterface>;
	let slackCommunicationServiceMock: DeepMocked<CommunicationServiceInterface>;
	let deleteCardServiceMock: DeepMocked<DeleteCardServiceInterface>;
	let createBoardUserServiceMock: DeepMocked<CreateBoardUserServiceInterface>;
	let deleteBoardUserServiceMock: DeepMocked<DeleteBoardUserServiceInterface>;

	let socketServiceMock: DeepMocked<SocketGateway>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				updateBoardService,
				{
					provide: getTeamService.provide,
					useValue: createMock<GetTeamServiceInterface>()
				},
				{
					provide: CommunicationsType.TYPES.services.SlackSendMessageService,
					useValue: createMock<SendMessageServiceInterface>()
				},
				{
					provide: CommunicationsType.TYPES.services.SlackCommunicationService,
					useValue: createMock<CommunicationServiceInterface>()
				},
				{
					provide: deleteCardService.provide,
					useValue: createMock<DeleteCardServiceInterface>()
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
					provide: boardUserRepository.provide,
					useValue: createMock<BoardUserRepositoryInterface>()
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
		deleteCardServiceMock = module.get(Cards.TYPES.services.DeleteCardService);
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
	});

	it('should be defined', () => {
		expect(boardService).toBeDefined();
	});

	describe('update', () => {
		it('should throw error if max votes is less than the highest votes on board', async () => {
			const updateBoardDto = UpdateBoardDtoFactory.create({ maxVotes: 2 });
			const boardUsers = BoardUserFactory.createMany(2, [{ votesCount: 3 }, { votesCount: 1 }]);

			jest.spyOn(getBoardUserServiceMock, 'getVotesCount').mockResolvedValueOnce(boardUsers);

			expect(async () => await boardService.update('1', updateBoardDto)).rejects.toThrow(
				BadRequestException
			);
		});

		it('should throw error if board not found', async () => {
			const updateBoardDto = UpdateBoardDtoFactory.create({ maxVotes: null });

			boardRepositoryMock.getBoard.mockResolvedValue(null);
			expect(async () => await boardService.update('-1', updateBoardDto)).rejects.toThrow(
				NotFoundException
			);
		});

		it('should call changeResponsibleOnBoard if current responsible is not equal to new responsible', async () => {
			const board = BoardFactory.create({ isSubBoard: true });
			const mainBoard = BoardFactory.create();
			const currentResponsible = BoardUserFactory.create({
				role: BoardRoles.RESPONSIBLE,
				board: board._id
			});
			const boardUsersDto = BoardUserDtoFactory.createMany(3, [
				{ board: board._id, role: BoardRoles.RESPONSIBLE },
				{
					board: board._id,
					role: BoardRoles.MEMBER,
					user: currentResponsible.user as User,
					_id: String(currentResponsible._id)
				},
				{ board: board._id, role: BoardRoles.MEMBER }
			]);
			const newResponsible = BoardUserFactory.create({
				board: board._id,
				role: BoardRoles.RESPONSIBLE,
				user: UserFactory.create({ _id: (boardUsersDto[0].user as User)._id }),
				_id: String(boardUsersDto[0]._id)
			});
			const updateBoardDto = UpdateBoardDtoFactory.create({
				responsible: newResponsible,
				mainBoardId: mainBoard._id,
				users: boardUsersDto,
				maxVotes: null,
				_id: board._id,
				isSubBoard: true
			});

			boardRepositoryMock.getBoard.mockResolvedValueOnce(board);

			//gets current responsible from the board
			jest
				.spyOn(getBoardUserServiceMock, 'getBoardResponsible')
				.mockResolvedValue(currentResponsible);

			await boardService.update(board._id, updateBoardDto);
			//update changeResponsibleOnBoard
			expect(updateBoardUserServiceMock.updateBoardUserRole).toBeCalled();
		});

		it('should throw error when update fails', async () => {
			const updateBoardDto = UpdateBoardDtoFactory.create({ maxVotes: null });
			const board = BoardFactory.create();

			boardRepositoryMock.getBoard.mockResolvedValue(board);
			boardRepositoryMock.updateBoard.mockResolvedValueOnce(null);

			expect(async () => await boardService.update('1', updateBoardDto)).rejects.toThrow(
				BadRequestException
			);
		});

		it('should call socketService.sendUpdatedBoard if socketId exists', async () => {
			const board = BoardFactory.create();
			const updateBoardDto = UpdateBoardDtoFactory.create({
				maxVotes: null,
				title: 'Mock 2.0',
				_id: board._id,
				socketId: faker.datatype.uuid()
			});
			const boardResult = { ...board, title: updateBoardDto.title };

			boardRepositoryMock.getBoard.mockResolvedValue(board);
			boardRepositoryMock.updateBoard.mockResolvedValue(boardResult);

			await boardService.update(board._id, updateBoardDto);

			expect(socketServiceMock.sendUpdatedBoard).toBeCalledTimes(1);
		});

		it('should call slackCommunicationService.executeResponsibleChange if board has a newResponsible and slack enable', async () => {
			const board = BoardFactory.create({
				isSubBoard: true,
				slackEnable: true,
				slackChannelId: faker.datatype.uuid()
			});
			const mainBoard = BoardFactory.create();
			const currentResponsible = BoardUserFactory.create({
				role: BoardRoles.RESPONSIBLE,
				board: board._id
			});
			const boardUsersDto = BoardUserDtoFactory.createMany(3, [
				{ board: board._id, role: BoardRoles.RESPONSIBLE },
				{
					board: board._id,
					role: BoardRoles.MEMBER,
					user: currentResponsible.user as User,
					_id: String(currentResponsible._id)
				},
				{ board: board._id, role: BoardRoles.MEMBER }
			]);
			const newResponsible = BoardUserFactory.create({
				board: board._id,
				role: BoardRoles.RESPONSIBLE,
				user: UserFactory.create({ _id: (boardUsersDto[0].user as User)._id }),
				_id: String(boardUsersDto[0]._id)
			});
			const updateBoardDto = UpdateBoardDtoFactory.create({
				responsible: newResponsible,
				mainBoardId: mainBoard._id,
				users: boardUsersDto,
				maxVotes: null,
				_id: board._id,
				isSubBoard: true
			});

			boardRepositoryMock.getBoard.mockResolvedValueOnce(board);
			boardRepositoryMock.updateBoard.mockResolvedValueOnce(board);

			jest
				.spyOn(getBoardUserServiceMock, 'getBoardResponsible')
				.mockResolvedValue(currentResponsible);

			await boardService.update(board._id, updateBoardDto);

			expect(slackCommunicationServiceMock.executeResponsibleChange).toBeCalledTimes(1);
		});

		it('should update a split board', async () => {
			const board = BoardFactory.create({ addCards: false });
			const updateBoardDto = UpdateBoardDtoFactory.create({
				maxVotes: null,
				title: 'Mock 2.0',
				_id: board._id,
				addCards: true
			});
			const boardResult = { ...board, title: updateBoardDto.title };

			boardRepositoryMock.getBoard.mockResolvedValue(board);
			boardRepositoryMock.updateBoard.mockResolvedValue(boardResult);

			const result = await boardService.update(board._id, updateBoardDto);

			expect(result).toEqual(boardResult);
		});

		it('should update regular board', async () => {
			const board = BoardFactory.create({ isSubBoard: false, dividedBoards: [] });

			board.columns[1].title = 'Make things';
			board.columns[1].color = '#FEB9A9';

			const updateBoardDto = UpdateBoardDtoFactory.create({
				maxVotes: null,
				_id: board._id,
				isSubBoard: false,
				dividedBoards: [],
				columns: board.columns as ColumnDto[],
				deletedColumns: [board.columns[0]._id]
			});

			boardRepositoryMock.getBoard.mockResolvedValueOnce(board);
			deleteCardServiceMock.deleteCardVotesFromColumn.mockResolvedValue(null);

			const boardResult = { ...board, columns: board.columns.slice(1) };

			boardRepositoryMock.updateBoard.mockResolvedValue(boardResult);

			const result = await boardService.update(board._id, updateBoardDto);

			expect(result).toEqual(boardResult);
		});
	});

	describe('mergeBoards', () => {
		it('should throw error when subBoard, board or subBoard.submittedByUser are undefined', async () => {
			const userId = faker.datatype.uuid();
			const board = BoardFactory.create({ isSubBoard: false });

			boardRepositoryMock.getBoard.mockResolvedValueOnce(null);
			boardRepositoryMock.getBoardByQuery.mockResolvedValueOnce(board);

			expect(async () => await boardService.mergeBoards('-1', userId)).rejects.toThrowError(
				BadRequestException
			);
		});

		it('should throw error if boardRepository.updateMergedSubBoard fails', async () => {
			const userId = faker.datatype.uuid();
			const board = BoardFactory.create({ isSubBoard: false });
			const subBoard = BoardFactory.create({ isSubBoard: true });

			boardRepositoryMock.getBoard.mockResolvedValueOnce(subBoard);
			boardRepositoryMock.getBoardByQuery.mockResolvedValueOnce(board);
			boardRepositoryMock.updateMergedSubBoard.mockResolvedValueOnce(null);

			expect(async () => await boardService.mergeBoards(subBoard._id, userId)).rejects.toThrowError(
				BadRequestException
			);
		});

		it('should throw error if boardRepository.updateMergedBoard fails', async () => {
			const userId = faker.datatype.uuid();
			const board = BoardFactory.create({ isSubBoard: false });
			const subBoard = BoardFactory.create({ isSubBoard: true });

			boardRepositoryMock.getBoard.mockResolvedValueOnce(subBoard);
			boardRepositoryMock.getBoardByQuery.mockResolvedValueOnce(board);
			boardRepositoryMock.updateMergedSubBoard.mockResolvedValueOnce(null);

			expect(async () => await boardService.mergeBoards(subBoard._id, userId)).rejects.toThrowError(
				BadRequestException
			);
		});

		it('should call slackCommunicationService.executeMergeBoardNotification if board has slackChannelId and slackEnable', async () => {
			const userId = faker.datatype.uuid();
			const subBoard = BoardFactory.create({ isSubBoard: true });
			const board = BoardFactory.create({
				isSubBoard: false,
				slackEnable: true,
				slackChannelId: faker.datatype.uuid(),
				dividedBoards: [subBoard]
			});

			boardRepositoryMock.getBoard.mockResolvedValueOnce(subBoard);
			boardRepositoryMock.getBoardByQuery.mockResolvedValueOnce(board);
			boardRepositoryMock.updateMergedSubBoard.mockResolvedValueOnce(subBoard);
			boardRepositoryMock.updateMergedBoard.mockResolvedValueOnce(board);

			await boardService.mergeBoards(subBoard._id, userId);

			expect(slackCommunicationServiceMock.executeMergeBoardNotification).toBeCalledTimes(1);
		});

		it('should call socketService.sendUpdatedAllBoard if there is a socketId', async () => {
			const userId = faker.datatype.uuid();
			const board = BoardFactory.create({
				isSubBoard: false,
				slackEnable: true,
				slackChannelId: faker.datatype.uuid()
			});
			const subBoard = BoardFactory.create({ isSubBoard: true });
			const socketId = faker.datatype.uuid();

			boardRepositoryMock.getBoard.mockResolvedValueOnce(subBoard);
			boardRepositoryMock.getBoardByQuery.mockResolvedValueOnce(board);
			boardRepositoryMock.updateMergedSubBoard.mockResolvedValueOnce(subBoard);
			boardRepositoryMock.updateMergedBoard.mockResolvedValueOnce(board);

			await boardService.mergeBoards(subBoard._id, userId, socketId);

			expect(socketServiceMock.sendUpdatedAllBoard).toBeCalledTimes(1);
		});

		it('should return merged board', async () => {
			const userId = faker.datatype.uuid();
			const board = BoardFactory.create({
				isSubBoard: false
			});
			const subBoard = BoardFactory.create({ isSubBoard: true });
			const newSubColumns = generateNewSubColumns(subBoard);

			boardRepositoryMock.getBoard.mockResolvedValue(subBoard);
			boardRepositoryMock.getBoardByQuery.mockResolvedValue(board);

			//mocks update of subBoard that is being merged
			const subBoardUpdated = { ...subBoard, submitedByUser: userId, submitedAt: new Date() };
			boardRepositoryMock.updateMergedSubBoard.mockResolvedValueOnce(subBoardUpdated);

			//mocks update to the mainBoard to merge cards from subBoard
			const boardResult = {
				...board,
				columns: mergeCardsFromSubBoardColumnsIntoMainBoard([...board.columns], newSubColumns)
			};
			boardRepositoryMock.updateMergedBoard.mockResolvedValueOnce(boardResult);

			const result = await boardService.mergeBoards(subBoard._id, userId);

			expect(result).toEqual(boardResult);
		});
	});

	describe('updateChannelId', () => {
		it('should call boardRepository.updatedChannelId', async () => {
			const teamsDto = TeamCommunicationDtoFactory.createMany(2);
			const board = BoardFactory.create();

			boardRepositoryMock.updatedChannelId.mockResolvedValue(board);
			boardService.updateChannelId(teamsDto);

			expect(boardRepositoryMock.updatedChannelId).toBeCalledTimes(teamsDto.length);
		});
	});

	describe('updateBoardParticipants', () => {
		it('should throw error when insert board users fails', async () => {
			const addUsers = BoardUserDtoFactory.createMany(3);
			const removedUsers = [];

			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce([]);
			expect(
				async () => await boardService.updateBoardParticipants(addUsers, removedUsers)
			).rejects.toThrowError(BadRequestException);
		});

		it('should throw error when delete board users fails', async () => {
			const addUsers = BoardUserDtoFactory.createMany(3);
			const boardUserToRemove = BoardUserFactory.create();
			const removedUsers = [boardUserToRemove._id];

			deleteBoardUserServiceMock.deleteBoardUsers.mockResolvedValueOnce(0);
			expect(
				async () => await boardService.updateBoardParticipants(addUsers, removedUsers)
			).rejects.toThrowError(BadRequestException);
		});

		it('should return boardUsers created', async () => {
			const addUsers = BoardUserDtoFactory.createMany(2);
			const boardUserToRemove = BoardUserFactory.create();
			const removedUsers = [boardUserToRemove._id];
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
		it('should throw error if updateBoardUserRole fails', async () => {
			const boardUserDto = BoardUserDtoFactory.create();

			updateBoardUserServiceMock.updateBoardUserRole.mockResolvedValueOnce(null);

			expect(
				async () => await boardService.updateBoardParticipantsRole(boardUserDto)
			).rejects.toThrowError(BadRequestException);
		});

		it('should return boardUser role updated', async () => {
			const boardUserDto = BoardUserDtoFactory.create({ role: BoardRoles.MEMBER });
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

		it('should call boardRepository ', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };
			await boardService.updatePhase(boardPhaseDto);
			expect(boardRepositoryMock.updatePhase).toBeCalledTimes(1);
		});

		it('should throw badRequestException when boardRepository fails', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };
			// Set up the board repository mock to reject with an error
			boardRepositoryMock.updatePhase.mockRejectedValueOnce(new Error('Some error'));

			// Verify that the service method being tested throws a BadRequestException
			expect(async () => await boardService.updatePhase(boardPhaseDto)).rejects.toThrowError(
				BadRequestException
			);
		});

		it('should call websocket with eventEmitter', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };
			// Call the service method being tested
			await boardService.updatePhase(boardPhaseDto);

			// Verify that the eventEmitterMock.emit method was called exactly once
			expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1);
		});

		it('should call slackSendMessageService.execute once with slackMessageDto', async () => {
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
		});

		it('should call slackSendMessageService.execute once with slackMessageDto', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };
			// Create a fake board object with the specified properties
			const board = BoardFactory.create();
			board.team = TeamFactory.create({ name: 'xgeeks' });

			board.phase = BoardPhases.VOTINGPHASE;
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
		});
	});
});

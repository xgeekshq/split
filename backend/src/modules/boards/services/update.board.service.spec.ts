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
import { BoardRoles } from 'src/libs/enum/board.roles';
import { BoardUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardUserDto-factory.mock';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import { SLACK_ENABLE, SLACK_MASTER_CHANNEL_ID } from 'src/libs/constants/slack';
import { FRONTEND_URL } from 'src/libs/constants/frontend';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import User from 'src/modules/users/entities/user.schema';
import ColumnDto from 'src/modules/columns/dto/column.dto';

describe('GetUpdateBoardService', () => {
	let boardService: UpdateBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let eventEmitterMock: DeepMocked<EventEmitter2>;
	let updateBoardUserServiceMock: DeepMocked<UpdateBoardUserServiceInterface>;
	let getBoardUserServiceMock: DeepMocked<GetBoardUserServiceInterface>;
	let configServiceMock: DeepMocked<ConfigService>;
	let slackSendMessageServiceMock: DeepMocked<SendMessageServiceInterface>;
	let deleteCardServiceMock: DeepMocked<DeleteCardServiceInterface>;

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
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(boardService).toBeDefined();
	});

	describe('update', () => {
		it('should be defined', () => {
			expect(boardService.update).toBeDefined();
		});

		it('should throw error if max votes is less than the highest votes on board', async () => {
			const updateBoardDto = UpdateBoardDtoFactory.create({ maxVotes: 2 });
			const boardUsers = BoardUserFactory.createMany(2, [{ votesCount: 3 }, { votesCount: 1 }]);

			jest.spyOn(getBoardUserServiceMock, 'getVotesCount').mockResolvedValueOnce(boardUsers);

			expect(async () => await boardService.update('1', updateBoardDto)).rejects.toThrow(
				BadRequestException
			);
		});

		it('should call boardRepository', async () => {
			const board = BoardFactory.create();
			const updateBoardDto = UpdateBoardDtoFactory.create({ maxVotes: null });

			await boardService.update(board._id, updateBoardDto);

			expect(boardRepositoryMock.getBoard).toBeCalledTimes(1);
		});

		it('should throw error if board not found', async () => {
			const updateBoardDto = UpdateBoardDtoFactory.create({ maxVotes: null });

			boardRepositoryMock.getBoard.mockResolvedValue(null);
			expect(async () => await boardService.update('-1', updateBoardDto)).rejects.toThrow(
				NotFoundException
			);
		});

		it('should call getBoardResponsibleInfo', async () => {
			const board = BoardFactory.create();
			const updateBoardDto = UpdateBoardDtoFactory.create({ maxVotes: null });

			boardRepositoryMock.getBoard.mockResolvedValueOnce(board);

			await boardService.update(board._id, updateBoardDto);

			expect(getBoardUserServiceMock.getBoardResponsible).toBeCalledTimes(1);
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

		it('should return updated board', async () => {
			const board = BoardFactory.create();
			const updateBoardDto = UpdateBoardDtoFactory.create({
				maxVotes: null,
				title: 'Mock 2.0',
				_id: board._id
			});
			const boardResult = { ...board, title: updateBoardDto.title };

			boardRepositoryMock.getBoard.mockResolvedValue(board);
			boardRepositoryMock.updateBoard.mockResolvedValue(boardResult);

			const result = await boardService.update(board._id, updateBoardDto);

			expect(result).toEqual(boardResult);
		});

		it('should updated board from a regular board', async () => {
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
	});
});

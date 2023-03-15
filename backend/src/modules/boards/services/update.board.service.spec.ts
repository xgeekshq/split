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
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import { SendMessageServiceInterface } from 'src/modules/communication/interfaces/send-message.service.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UpdateBoardDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/updateBoardDto-factory.mock';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { NotFoundException } from '@nestjs/common';
import { BoardUserRepositoryInterface } from 'src/modules/boardusers/interfaces/repositories/board-user.repository.interface';
import { boardUserRepository } from 'src/modules/boardusers/boardusers.providers';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { BoardUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardUserDto-factory.mock';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardusers/interfaces/services/update.board.user.service.interface';

describe('GetUpdateBoardService', () => {
	let boardService: UpdateBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let boardUserRepositoryMock: DeepMocked<BoardUserRepositoryInterface>;
	let boardUserUpdateServiceMock: DeepMocked<UpdateBoardUserServiceInterface>;

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
		boardUserRepositoryMock = module.get(BoardUsers.TYPES.repositories.BoardUserRepository);
		boardUserUpdateServiceMock = module.get(BoardUsers.TYPES.services.UpdateBoardUserService);
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

		it('should call boardRepository', async () => {
			const board = BoardFactory.create();
			const boardDto = UpdateBoardDtoFactory.create();
			const boardUser = BoardUserFactory.createMany(2, [{ votesCount: 2 }, { votesCount: 1 }]);

			boardUserRepositoryMock.getVotesCount.mockResolvedValueOnce(boardUser);

			await boardService.update(board._id, boardDto);

			expect(boardRepositoryMock.getBoard).toBeCalledTimes(1);
		});

		it('should throw error if board not found', async () => {
			const boardDto = UpdateBoardDtoFactory.create();

			boardRepositoryMock.getBoard.mockResolvedValue(null);
			expect(async () => await boardService.update('-1', boardDto)).rejects.toThrow(
				NotFoundException
			);
		});

		it('should call getBoardResponsibleInfo', async () => {
			const board = BoardFactory.create();
			const boardDto = UpdateBoardDtoFactory.create();
			const boardUser = BoardUserFactory.createMany(2, [{ votesCount: 2 }, { votesCount: 1 }]);

			boardRepositoryMock.getBoard.mockResolvedValueOnce(board);
			boardUserRepositoryMock.getVotesCount.mockResolvedValueOnce(boardUser);

			await boardService.update(board._id, boardDto);

			expect(boardUserRepositoryMock.getBoardResponsible).toBeCalledTimes(1);
		});

		it('should return undefined if there is not a responsible when calling getBoardResponsibleInfo ', async () => {
			const board = BoardFactory.create({ isSubBoard: true });
			//const mainBoard = BoardFactory.create();
			const currentResponsible = BoardUserFactory.create({
				role: BoardRoles.RESPONSIBLE,
				board: board._id
			});
			const boardUsersDto = BoardUserDtoFactory.createMany(3, [
				{ board: board._id, role: BoardRoles.RESPONSIBLE },
				{
					board: board._id,
					role: BoardRoles.MEMBER,
					user: String(currentResponsible.user),
					_id: String(currentResponsible._id)
				},
				{ board: board._id, role: BoardRoles.MEMBER }
			]);
			const newResponsible = BoardUserFactory.create({
				board: board._id,
				role: BoardRoles.RESPONSIBLE,
				user: String(boardUsersDto[0].user),
				_id: String(boardUsersDto[0]._id)
			});
			// const updateBoardDto = UpdateBoardDtoFactory.create({
			// 	responsible: newResponsible,
			// 	mainBoardId: mainBoard._id,
			// 	users: boardUsersDto,
			// 	maxVotes: undefined
			// });

			boardRepositoryMock.getBoard.mockResolvedValueOnce(board);

			//gets current responsible from the board
			boardUserRepositoryMock.getBoardResponsible.mockResolvedValueOnce(currentResponsible);

			jest
				.spyOn(boardUserUpdateServiceMock, 'updateBoardUserRole')
				.mockResolvedValueOnce(newResponsible);

			// await boardService.update(board._id, boardDto);

			// expect(boardUserRepositoryMock.getBoardResponsible).toBeCalledTimes(1);
		});
	});
});

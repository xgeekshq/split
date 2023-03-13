import { boardUserRepository, updateBoardService } from './../boards.providers';
import { Test, TestingModule } from '@nestjs/testing';
import { getTeamService } from 'src/modules/teams/providers';
import { boardRepository } from '../boards.providers';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BoardUserRepositoryInterface } from '../repositories/board-user.repository.interface';
import { DeleteCardServiceInterface } from 'src/modules/cards/interfaces/services/delete.card.service.interface';
import { deleteCardService } from 'src/modules/cards/cards.providers';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import { SendMessageServiceInterface } from 'src/modules/communication/interfaces/send-message.service.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UpdateBoardDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/updateBoardDto-factory.mock';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { NotFoundException } from '@nestjs/common';

describe('GetUpdateBoardService', () => {
	let boardService: UpdateBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let boardUserRepositoryMock: DeepMocked<BoardUserRepositoryInterface>;

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
		boardUserRepositoryMock = module.get(Boards.TYPES.repositories.BoardUserRepository);
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
	});
});

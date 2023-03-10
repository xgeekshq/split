import { Test, TestingModule } from '@nestjs/testing';
import UpdateBoardServiceImpl from './update.board.service';
import { boardRepository } from '../boards.providers';
import { getTeamService } from 'src/modules/teams/providers';
import { getModelToken } from '@nestjs/mongoose';
import Board from 'src/modules/boards/entities/board.schema';
import { ConfigService } from '@nestjs/config';
import BoardUser from '../entities/board.user.schema';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import DeleteCardServiceImpl from 'src/modules/cards/services/delete.card.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import * as Cards from 'src/modules/cards/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { SlackCommunicationService } from 'src/modules/communication/services/slack-communication.service';
import GetTeamService from 'src/modules/teams/services/get.team.service';
import { SlackSendMessageService } from 'src/modules/communication/services/slack-send-messages.service';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { BoardRepository } from '../repositories/board.repository';
import { BadRequestException } from '@nestjs/common';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { SLACK_ENABLE, SLACK_MASTER_CHANNEL_ID } from 'src/libs/constants/slack';
import { FRONTEND_URL } from 'src/libs/constants/frontend';

describe('UpdateBoardServiceImpl', () => {
	let service: UpdateBoardServiceImpl;
	let eventEmitterMock: DeepMocked<EventEmitter2>;
	let boardRepositoryMock: DeepMocked<BoardRepository>;
	let configServiceMock: DeepMocked<ConfigService>;
	let slackSendMessageServiceMock: DeepMocked<SlackSendMessageService>;
	const fakeBoards = BoardFactory.create();

	const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateBoardServiceImpl,
				{
					provide: getModelToken(Board.name),
					useValue: {}
				},
				{
					provide: getTeamService.provide,
					useValue: createMock<GetTeamService>()
				},
				{
					provide: CommunicationsType.TYPES.services.SlackCommunicationService,
					useValue: createMock<SlackCommunicationService>
				},
				{
					provide: CommunicationsType.TYPES.services.SlackSendMessageService,
					useValue: createMock<SlackSendMessageService>()
				},
				{
					provide: getModelToken(BoardUser.name),
					useValue: {}
				},
				{
					provide: SocketGateway,
					useValue: createMock<SocketGateway>()
				},
				{
					provide: Cards.TYPES.services.DeleteCardService,
					useValue: createMock<DeleteCardServiceImpl>()
				},
				{
					provide: boardRepository.provide,
					useValue: createMock<BoardRepository>()
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
		service = module.get<UpdateBoardServiceImpl>(UpdateBoardServiceImpl);
		eventEmitterMock = module.get(EventEmitter2);
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
		configServiceMock = module.get(ConfigService);
		slackSendMessageServiceMock = module.get(
			CommunicationsType.TYPES.services.SlackSendMessageService
		);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('updatePhase', () => {
		it('should be defined', () => {
			expect(service.updatePhase).toBeDefined();
		});

		it('should call boardRepository ', async () => {
			await service.updatePhase(boardPhaseDto);
			expect(boardRepositoryMock.updatePhase).toBeCalledTimes(1);
		});

		it('should throw badRequestException when boardRepository fails', async () => {
			// Set up the board repository mock to reject with an error
			boardRepositoryMock.updatePhase.mockRejectedValueOnce(new Error('Some error'));

			// Verify that the service method being tested throws a BadRequestException
			expect(async () => await service.updatePhase(boardPhaseDto)).rejects.toThrowError(
				BadRequestException
			);
		});

		it('shoult call websocket with eventEmitter', async () => {
			// Call the service method being tested
			await service.updatePhase(boardPhaseDto);

			// Verify that the eventEmitterMock.emit method was called exactly once
			expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1);
		});

		it('should call slackSendMessageService.execute with slackMessageDto 1 time', async () => {
			// Create a fake board object with the specified properties
			const board = {
				...fakeBoards,
				team: { name: 'xgeeks' },
				phase: BoardPhases.VOTINGPHASE,
				slackEnable: true,
				columns: [
					{},
					{},
					{
						_id: 'ee8279e5-cd81-4950-ae12-4e0833f3a029',
						title: 'enim repudiandae aut',
						color: '#aaaaaa',
						cards: [{ text: 'someText' }, { text: 'someText' }],
						cardText: 'totam ut repellendus',
						isDefaultText: false
					}
				]
			};

			// Set up the board repository mock to resolve with the fake board object
			boardRepositoryMock.updatePhase.mockResolvedValue(
				board as unknown as ReturnType<typeof boardRepositoryMock.updatePhase>
			);

			// Set up the configuration service mock
			configServiceMock.getOrThrow.mockImplementation((string: string) => {
				if (string === SLACK_MASTER_CHANNEL_ID) {
					return '6405f9a04633b1668f71c068';
				}

				if (string === SLACK_ENABLE) {
					return true;
				}

				if (string === FRONTEND_URL) {
					return 'https://split.kigroup.de/';
				}
			});

			// Call the service method being tested
			await service.updatePhase(boardPhaseDto);

			// Verify that the slackSendMessageService.execute method with correct data 1 time
			expect(slackSendMessageServiceMock.execute).toHaveBeenNthCalledWith(1, {
				slackChannelId: expect.stringContaining('6405f9a04633b1668f71c068'),
				message: expect.stringContaining('https://split.kigroup.de/')
			});
		});
	});
});

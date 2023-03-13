import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import * as Cards from 'src/modules/cards/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as Teams from 'src/modules/teams/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { BadRequestException } from '@nestjs/common';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { SLACK_ENABLE, SLACK_MASTER_CHANNEL_ID } from 'src/libs/constants/slack';
import { FRONTEND_URL } from 'src/libs/constants/frontend';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import { SendMessageServiceInterface } from 'src/modules/communication/interfaces/send-message.service.interface';
import { DeleteCardServiceInterface } from 'src/modules/cards/interfaces/services/delete.card.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { updateBoardService } from '../boards.providers';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';

describe('UpdateBoardService', () => {
	let service: UpdateBoardServiceInterface;
	let eventEmitterMock: DeepMocked<EventEmitter2>;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let configServiceMock: DeepMocked<ConfigService>;
	let slackSendMessageServiceMock: DeepMocked<SendMessageServiceInterface>;

	const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				updateBoardService,
				{
					provide: Teams.TYPES.services.GetTeamService,
					useValue: {}
				},
				{
					provide: CommunicationsType.TYPES.services.SlackCommunicationService,
					useValue: createMock<CommunicationServiceInterface>()
				},
				{
					provide: CommunicationsType.TYPES.services.SlackSendMessageService,
					useValue: createMock<SendMessageServiceInterface>()
				},
				{
					provide: SocketGateway,
					useValue: createMock<SocketGateway>()
				},
				{
					provide: Cards.TYPES.services.DeleteCardService,
					useValue: createMock<DeleteCardServiceInterface>()
				},
				{
					provide: Boards.TYPES.repositories.BoardRepository,
					useValue: createMock<BoardRepositoryInterface>()
				},
				{
					provide: Boards.TYPES.repositories.BoardUserRepository,
					useValue: {}
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
		service = module.get<UpdateBoardServiceInterface>(updateBoardService.provide);
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

		it('should call websocket with eventEmitter', async () => {
			// Call the service method being tested
			await service.updatePhase(boardPhaseDto);

			// Verify that the eventEmitterMock.emit method was called exactly once
			expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1);
		});

		it('should call slackSendMessageService.execute once with slackMessageDto', async () => {
			// Create a fake board object with the specified properties
			const board = BoardFactory.create();
			board.team = { name: 'xgeeks' };
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
			await service.updatePhase(boardPhaseDto);

			// Verify that the slackSendMessageService.execute method with correct data 1 time
			expect(slackSendMessageServiceMock.execute).toHaveBeenNthCalledWith(1, {
				slackChannelId: '6405f9a04633b1668f71c068',
				message: expect.stringContaining('https://split.kigroup.de/')
			});
		});
	});
});

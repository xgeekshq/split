import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { FRONTEND_URL } from 'src/libs/constants/frontend';
import { SLACK_ENABLE, SLACK_MASTER_CHANNEL_ID } from 'src/libs/constants/slack';
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import { SendMessageServiceInterface } from 'src/modules/communication/interfaces/send-message.service.interface';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { UpdateBoardPhaseUseCase } from './update-board-phase.use-case';
import { BOARD_REPOSITORY } from 'src/modules/boards/constants';

describe('UpdateBoardPhaseUseCase', () => {
	let useCase: UseCase<BoardPhaseDto, void>;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let eventEmitterMock: DeepMocked<EventEmitter2>;
	let configServiceMock: DeepMocked<ConfigService>;
	let slackSendMessageServiceMock: DeepMocked<SendMessageServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateBoardPhaseUseCase,
				{
					provide: CommunicationsType.TYPES.services.SlackSendMessageService,
					useValue: createMock<SendMessageServiceInterface>()
				},
				{
					provide: BOARD_REPOSITORY,
					useValue: createMock<BoardRepositoryInterface>()
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

		useCase = module.get(UpdateBoardPhaseUseCase);
		boardRepositoryMock = module.get(BOARD_REPOSITORY);
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
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		it('should throw the badRequestException when updated board is null', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };
			// Set up the board repository mock to reject with an error
			boardRepositoryMock.updatePhase.mockResolvedValue(null);

			// Verify that the service method that is being tested throws a BadRequestException
			expect(async () => await useCase.execute(boardPhaseDto)).rejects.toThrowError(
				UpdateFailedException
			);
		});

		it('should throw the badRequestException when the phase of the updated board is not equal to the phase of the DTO', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };
			const board = BoardFactory.create({ phase: BoardPhases.VOTINGPHASE, slackEnable: true });
			// Set up the board repository mock to reject with an error
			boardRepositoryMock.updatePhase.mockResolvedValue(board);

			// Verify that the service method that is being tested throws a BadRequestException
			expect(async () => await useCase.execute(boardPhaseDto)).rejects.toThrowError(
				UpdateFailedException
			);
		});

		it('should call the eventEmitter if updated phase is ADDCARDS', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };
			// Create a fake board object with the specified properties
			const board = BoardFactory.create({ phase: BoardPhases.ADDCARDS, slackEnable: true });
			board.team = TeamFactory.create({ name: 'xgeeks' });

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
			await useCase.execute(boardPhaseDto);

			expect(boardRepositoryMock.updatePhase).toHaveBeenCalledTimes(1);
			expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1);
		});

		it('should call the slackSendMessageService.execute once with slackMessageDto (Phase: VOTIINGPHASE)', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.VOTINGPHASE };
			// Create a fake board object with the specified properties
			const board = BoardFactory.create({ phase: BoardPhases.VOTINGPHASE, slackEnable: true });
			board.team = TeamFactory.create({ name: 'xgeeks' });

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
			await useCase.execute(boardPhaseDto);

			expect(boardRepositoryMock.updatePhase).toHaveBeenCalledTimes(1);
			expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1);
			// Verify that the slackSendMessageService.execute method with correct data 1 time
			expect(slackSendMessageServiceMock.execute).toHaveBeenNthCalledWith(1, {
				slackChannelId: '6405f9a04633b1668f71c068',
				message: expect.stringContaining('https://split.kigroup.de/')
			});
		});

		it('should call the slackSendMessageService.execute once with slackMessageDto (Phase: SUBMITTED)', async () => {
			const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.SUBMITTED };
			// Create a fake board object with the specified properties
			const board = BoardFactory.create({ phase: BoardPhases.SUBMITTED, slackEnable: true });
			board.team = TeamFactory.create({ name: 'xgeeks' });

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
			await useCase.execute(boardPhaseDto);

			expect(boardRepositoryMock.updatePhase).toHaveBeenCalledTimes(1);
			expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1);
			// Verify that the slackSendMessageService.execute method with correct data 1 time
			expect(slackSendMessageServiceMock.execute).toHaveBeenNthCalledWith(1, {
				slackChannelId: '6405f9a04633b1668f71c068',
				message: expect.stringContaining('https://split.kigroup.de/')
			});
		});
	});
});

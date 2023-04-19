import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { TYPES } from 'src/modules/communication/interfaces/types';
import { BoardType } from '../dto/types';
import { Job } from 'bull';
import { SlackCommunicationConsumer } from './slack-communication.consumer';
import { CommunicationApplicationInterface } from '../interfaces/communication.application.interface';
import { UpdateBoardServiceInterface } from 'src/modules/boards/interfaces/services/update.board.service.interface';
import { Logger } from '@nestjs/common';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { UPDATE_BOARD_SERVICE } from 'src/modules/boards/constants';

const BoardTypeMock = {
	id: 1,
	data: {
		id: 'someId',
		title: 'someTitle',
		isSubBoard: true,
		dividedBoards: 'BoardType[]',
		team: null,
		users: '',
		slackChannelId: 'someSlackChannelId',
		boardNumber: 1
	}
};

const result = [
	{
		name: 'someName',
		normalName: 'normalName',
		boardId: 'someBoardId',
		channelId: 'someChannelId',
		type: 'team',
		for: 'member',
		participants: UserFactory.createMany(2),
		teamNumber: 2
	}
];

describe('SlackCommunicationConsumer', () => {
	let consumer: SlackCommunicationConsumer;
	let communicationAppMock: DeepMocked<CommunicationApplicationInterface>;
	let updateBoardServiceMock: DeepMocked<UpdateBoardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackCommunicationConsumer,
				{
					provide: TYPES.application.SlackCommunicationApplication,
					useValue: createMock<CommunicationApplicationInterface>()
				},
				{
					provide: UPDATE_BOARD_SERVICE,
					useValue: createMock<UpdateBoardServiceInterface>()
				}
			]
		}).compile();
		consumer = module.get(SlackCommunicationConsumer);
		communicationAppMock = module.get(TYPES.application.SlackCommunicationApplication);
		updateBoardServiceMock = module.get(UPDATE_BOARD_SERVICE);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(consumer).toBeDefined();
	});

	describe('communication', () => {
		it('should call application.execute once with job.data', async () => {
			await consumer.communication(BoardTypeMock as unknown as Job<BoardType>);
			expect(communicationAppMock.execute).toHaveBeenNthCalledWith(1, BoardTypeMock.data);
		});

		it('should call Logger when type BOARD', async () => {
			const spyLogger = jest.spyOn(Logger.prototype, 'verbose');
			await consumer.communication(BoardTypeMock as unknown as Job<BoardType>);
			expect(spyLogger).toBeCalledTimes(1);
		});
	});

	describe('onCompleted', () => {
		it('should call Logger once', async () => {
			const spyLogger = jest.spyOn(Logger.prototype, 'verbose');
			await consumer.onCompleted(
				BoardTypeMock as unknown as Job<BoardType>,
				result as unknown as TeamDto[]
			);
			expect(spyLogger).toBeCalledTimes(1);
		});
		it('should call updateBoardService once', async () => {
			await consumer.onCompleted(
				BoardTypeMock as unknown as Job<BoardType>,
				result as unknown as TeamDto[]
			);
			expect(updateBoardServiceMock.updateChannelId).toBeCalledTimes(1);
		});
	});
});

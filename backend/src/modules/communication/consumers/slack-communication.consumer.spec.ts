import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { TYPES } from 'src/modules/communication/interfaces/types';
import { TYPES as BOARD_TYPES } from 'src/modules/boards/interfaces/types';
import { BoardType } from '../dto/types';
import { Job } from 'bull';
import { SlackCommunicationConsumer } from './slack-communication.consumer';
import { CommunicationApplicationInterface } from '../interfaces/communication.application.interface';
import { UpdateBoardServiceInterface } from 'src/modules/boards/interfaces/services/update.board.service.interface';
import { Logger } from '@nestjs/common';

const mergeBoardTypeMock = {
	id: 1,
	data: {
		id: 'someId',
		title: 'someTitle',
		isSubBoard: true,
		dividedBoards: 'BoardType[]',
		team: null,
		users: 'UserRoleType[]',
		slackChannelId: 'someSlackChannelId',
		boardNumber: 1
	}
};

describe('SlackCommunicationConsumer', () => {
	let consumer: SlackCommunicationConsumer;
	let communicationAppMock: DeepMocked<CommunicationApplicationInterface>;
	//let updateBoardServiceMock: DeepMocked<UpdateBoardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackCommunicationConsumer,
				{
					provide: TYPES.application.SlackCommunicationApplication,
					useValue: createMock<CommunicationApplicationInterface>()
				},
				{
					provide: BOARD_TYPES.services.UpdateBoardService,
					useValue: createMock<UpdateBoardServiceInterface>()
				}
			]
		}).compile();
		consumer = module.get<SlackCommunicationConsumer>(SlackCommunicationConsumer);
		communicationAppMock = module.get(TYPES.application.SlackCommunicationApplication);
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
			await consumer.communication(mergeBoardTypeMock as unknown as Job<BoardType>);
			expect(communicationAppMock.execute).toHaveBeenNthCalledWith(1, mergeBoardTypeMock.data);
		});

		it('should call Logger when type BOARD', async () => {
			const spyLogger = jest.spyOn(Logger.prototype, 'verbose');
			await consumer.communication(mergeBoardTypeMock as unknown as Job<BoardType>);
			expect(spyLogger).toBeCalledTimes(1);
		});
	});

	//  describe('onCompleted',()=> {
	//  	it('should call application.execute once with job.data', async () => {
	//  		await consumer.onCompleted(mergeBoardTypeMock as unknown as Job<BoardType>);
	//  		//expect(responsibleApplicationMock.execute).toHaveBeenNthCalledWith(1, mergeBoardTypeMock.data);
	//  	});
	//  });
});

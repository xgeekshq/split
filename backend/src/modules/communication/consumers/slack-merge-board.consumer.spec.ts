import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { MergeBoardType } from '../dto/types';
import { Job } from 'bull';
import { SlackMergeBoardConsumer } from './slack-merge-board.consumer';
import { MergeBoardApplicationInterface } from '../interfaces/merge-board.application.interface';
import { SLACK_MERGE_BOARD_APPLICATION } from 'src/modules/communication/constants';

const mergeBoardTypeMock = {
	id: 1,
	data: {
		teamNumber: 1,
		responsiblesChannelId: 'someResponsiblesChannelId',
		isLastSubBoard: true,
		boardId: 'someBoardId',
		mainBoardId: 'mainBoardId'
	}
};

describe('SlackMergeBoardConsumer', () => {
	let consumer: SlackMergeBoardConsumer;
	let applicationMock: DeepMocked<MergeBoardApplicationInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackMergeBoardConsumer,
				{
					provide: SLACK_MERGE_BOARD_APPLICATION,
					useValue: createMock<MergeBoardApplicationInterface>()
				}
			]
		}).compile();
		consumer = module.get(SlackMergeBoardConsumer);
		applicationMock = module.get(SLACK_MERGE_BOARD_APPLICATION);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(consumer).toBeDefined();
	});

	it('should call application.execute once with job.data', async () => {
		await consumer.communication(mergeBoardTypeMock as unknown as Job<MergeBoardType>);
		expect(applicationMock.execute).toHaveBeenNthCalledWith(1, mergeBoardTypeMock.data);
	});
});

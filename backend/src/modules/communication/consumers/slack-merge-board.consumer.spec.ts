import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { TYPES } from 'src/modules/communication/interfaces/types';
import { MergeBoardType } from '../dto/types';
import { Job } from 'bull';
import { SlackMergeBoardConsumer } from './slack-merge-board.consumer';
import { MergeBoardApplicationInterface } from '../interfaces/merge-board.application.interface';

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
					provide: TYPES.application.SlackMergeBoardApplication,
					useValue: createMock<MergeBoardApplicationInterface>()
				}
			]
		}).compile();
		consumer = module.get<SlackMergeBoardConsumer>(SlackMergeBoardConsumer);
		applicationMock = module.get(TYPES.application.SlackMergeBoardApplication);
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

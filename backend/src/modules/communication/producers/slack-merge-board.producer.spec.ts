import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Job, Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { SlackMergeBoardProducer } from './slack-merge-board.producer';
import mockedMergeBoardType from 'src/libs/test-utils/mocks/factories/communication/mergeBoardType.mock';
import { BoardType } from '../dto/types';

const job = {
	id: 'someId',
	data: mockedMergeBoardType
};

describe('SlackMergeBoardProducer', () => {
	let producer: SlackMergeBoardProducer;
	let queueMock: DeepMocked<Queue>;

	const spyLoggerVerbose = jest.spyOn(Logger.prototype, 'verbose').mockImplementation(jest.fn);

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackMergeBoardProducer,
				{
					provide: getQueueToken(SlackMergeBoardProducer.name),
					useValue: createMock<Queue>()
				}
			]
		}).compile();
		producer = module.get<SlackMergeBoardProducer>(SlackMergeBoardProducer);
		queueMock = module.get(getQueueToken(SlackMergeBoardProducer.name));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(producer).toBeDefined();
	});

	it('should add boardType to queue', async () => {
		await producer.add(mockedMergeBoardType);
		expect(queueMock.add).toHaveBeenNthCalledWith(1, mockedMergeBoardType);
	});

	it('should call logger and containt board id', async () => {
		queueMock.add.mockResolvedValue(job as unknown as Job<BoardType>);

		await producer.add(mockedMergeBoardType);

		expect(spyLoggerVerbose).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining(mockedMergeBoardType.teamNumber.toString())
		);
	});
});

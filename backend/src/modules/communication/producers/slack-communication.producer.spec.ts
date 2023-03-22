import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { SlackCommunicationProducer } from './slack-communication.producer';
import { BoardTypeFactory } from 'src/libs/test-utils/mocks/factories/communication/boardType-factory.mock';
import { Logger } from '@nestjs/common';

describe('SlackCommunicationProducer', () => {
	let producer: SlackCommunicationProducer;
	let queueMock: DeepMocked<Queue>;

	const spyLoggerVerbose = jest.spyOn(Logger.prototype, 'verbose').mockImplementation(jest.fn);

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackCommunicationProducer,
				{
					provide: getQueueToken(SlackCommunicationProducer.name),
					useValue: createMock<Queue>()
				}
			]
		}).compile();
		producer = module.get<SlackCommunicationProducer>(SlackCommunicationProducer);
		queueMock = module.get(getQueueToken(SlackCommunicationProducer.name));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(producer).toBeDefined();
	});

	it('should add boardType to queue', async () => {
		const boardType = BoardTypeFactory.create();
		await producer.add(boardType);
		expect(queueMock.add).toHaveBeenNthCalledWith(1, boardType);
	});

	it('should call logger and containt board id', async () => {
		const boardType = BoardTypeFactory.create();
		await producer.add(boardType);
		expect(spyLoggerVerbose).toHaveBeenNthCalledWith(1, expect.stringContaining(boardType.id));
	});
});

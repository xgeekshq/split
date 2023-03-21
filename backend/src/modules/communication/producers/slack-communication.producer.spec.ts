import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { SlackCommunicationProducer } from './slack-communication.producer';

describe('SlackArchiveChannelProducer', () => {
	let producer: SlackCommunicationProducer;
	//let queueMock: DeepMocked<Queue>;

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
		//queueMock = module.get(getQueueToken(SlackCommunicationProducer.name));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(producer).toBeDefined();
	});
});

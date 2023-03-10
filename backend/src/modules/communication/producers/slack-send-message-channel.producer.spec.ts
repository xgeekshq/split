import { Test, TestingModule } from '@nestjs/testing';
import { SlackSendMessageProducer } from './slack-send-message-channel.producer';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { SlackMessageType } from '../dto/types';

const slackMessageMock: SlackMessageType = {
	slackChannelId: '6405f9a04633b1668f71c068',
	message: 'someMessage'
};

describe('SlackSendMessageProducer', () => {
	let producer: SlackSendMessageProducer;
	let queueMock: DeepMocked<Queue>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackSendMessageProducer,
				{
					provide: getQueueToken(SlackSendMessageProducer.name),
					useValue: createMock<Queue>()
				}
			]
		}).compile();
		producer = module.get<SlackSendMessageProducer>(SlackSendMessageProducer);
		queueMock = module.get(getQueueToken(SlackSendMessageProducer.name));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(producer).toBeDefined();
	});

	it('should call queue.add with SlackMessageType 1 time', async () => {
		await producer.send(slackMessageMock);
		expect(queueMock.add).toHaveBeenNthCalledWith(1, slackMessageMock);
	});
});

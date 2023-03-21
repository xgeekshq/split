import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { SlackAddUserToChannelProducer } from './slack-add-user-channel.producer';
import { Logger } from '@nestjs/common';

const addUserMainChannelMock = {
	email: 'someEmail@gmail.com'
};
const spyLoggerVerbose = jest.spyOn(Logger.prototype, 'verbose').mockImplementation(jest.fn);
describe('SlackAddUserToChannelProducer', () => {
	let producer: SlackAddUserToChannelProducer;
	let queueMock: DeepMocked<Queue>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackAddUserToChannelProducer,
				{
					provide: getQueueToken(SlackAddUserToChannelProducer.name),
					useValue: createMock<Queue>()
				}
			]
		}).compile();
		producer = module.get<SlackAddUserToChannelProducer>(SlackAddUserToChannelProducer);
		queueMock = module.get(getQueueToken(SlackAddUserToChannelProducer.name));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(producer).toBeDefined();
	});

	it('should call queue.add with SlackMessageType once', async () => {
		await producer.add(addUserMainChannelMock);
		expect(queueMock.add).toHaveBeenNthCalledWith(1, addUserMainChannelMock);
	});

	it('should call logger.verbose with SlackMessageType once', async () => {
		await producer.add(addUserMainChannelMock);
		expect(spyLoggerVerbose).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining(addUserMainChannelMock.email)
		);
	});
});

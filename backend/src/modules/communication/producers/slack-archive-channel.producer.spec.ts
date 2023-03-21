import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { SlackArchiveChannelProducer } from './slack-archive-channel.producer';
import { ArchiveChannelDataOptions } from '../dto/types';

const archiveChannelDataMock = {
	type: ArchiveChannelDataOptions.CHANNEL_ID,
	data: { id: 'someId', slackChannelId: 'someId' }
};
const spyLoggerVerbose = jest.spyOn(Logger.prototype, 'verbose').mockImplementation(jest.fn);
describe('SlackArchiveChannelProducer', () => {
	let producer: SlackArchiveChannelProducer;
	let queueMock: DeepMocked<Queue>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackArchiveChannelProducer,
				{
					provide: getQueueToken(SlackArchiveChannelProducer.name),
					useValue: createMock<Queue>()
				}
			]
		}).compile();
		producer = module.get<SlackArchiveChannelProducer>(SlackArchiveChannelProducer);
		queueMock = module.get(getQueueToken(SlackArchiveChannelProducer.name));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(producer).toBeDefined();
	});

	it('should call queue.add with archiveChannelData once', async () => {
		await producer.add(archiveChannelDataMock);
		expect(queueMock.add).toHaveBeenNthCalledWith(1, archiveChannelDataMock);
	});

	it('should call logger.verbose when ArchiveChannelDataOptions.CHANNEL_ID', async () => {
		await producer.add(archiveChannelDataMock);
		expect(spyLoggerVerbose).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining(archiveChannelDataMock.data.id)
		);
	});

	it('should call logger.verbose when ArchiveChannelDataOptions.BOARD', async () => {
		archiveChannelDataMock.type = ArchiveChannelDataOptions.BOARD;
		await producer.add(archiveChannelDataMock);
		expect(spyLoggerVerbose).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining(archiveChannelDataMock.data.id)
		);
	});
});

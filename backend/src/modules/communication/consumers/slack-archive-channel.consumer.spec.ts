import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { TYPES } from 'src/modules/communication/interfaces/types';
import { ArchiveChannelData } from '../dto/types';
import { Job } from 'bull';
import { SlackArchiveChannelConsumer } from './slack-archive-channel.consumer';
import { ArchiveChannelApplicationInterface } from '../interfaces/archive-channel.application.interface';
import { Logger } from '@nestjs/common';

const archiveChannelDataMock = {
	id: 1,
	data: {
		type: 'CHANNEL_ID',
		data: { id: '1', slackChannelId: 'someSlackId' },
		cascade: true
	}
};

describe('SlackArchiveChannelConsumer', () => {
	let consumer: SlackArchiveChannelConsumer;
	let addUserIntoChannelAppMock: DeepMocked<ArchiveChannelApplicationInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackArchiveChannelConsumer,
				{
					provide: TYPES.application.SlackArchiveChannelApplication,
					useValue: createMock<ArchiveChannelApplicationInterface>()
				}
			]
		}).compile();
		consumer = module.get<SlackArchiveChannelConsumer>(SlackArchiveChannelConsumer);
		addUserIntoChannelAppMock = module.get(TYPES.application.SlackArchiveChannelApplication);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(consumer).toBeDefined();
	});

	describe('communication', () => {
		it('should call ArchiveChannelApplication.execute once with job.data', async () => {
			await consumer.communication(archiveChannelDataMock as unknown as Job<ArchiveChannelData>);

			expect(addUserIntoChannelAppMock.execute).toHaveBeenNthCalledWith(
				1,
				archiveChannelDataMock.data
			);
		});

		it('should call Logger when type CHANNEL_ID', async () => {
			const spyLogger = jest.spyOn(Logger.prototype, 'verbose');
			//Type  'CHANNEL_ID'
			await consumer.communication(archiveChannelDataMock as unknown as Job<ArchiveChannelData>);
			expect(spyLogger).toBeCalledTimes(1);
		});
		it('should call Logger when type BOARD', async () => {
			const spyLogger = jest.spyOn(Logger.prototype, 'verbose');
			archiveChannelDataMock.data.type = 'BOARD';
			//Type  'BOARD'
			await consumer.communication(archiveChannelDataMock as unknown as Job<ArchiveChannelData>);
			expect(spyLogger).toBeCalledTimes(1);
		});
	});
});

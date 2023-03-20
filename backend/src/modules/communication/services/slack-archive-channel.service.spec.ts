import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ArchiveChannelData, ArchiveChannelDataOptions } from '../dto/types';
import { SlackArchiveChannelService } from './slack-archive-channel.service';
import { ArchiveChannelServiceInterface } from '../interfaces/archive-channel.service.interface';
import { SlackArchiveChannelProducer } from '../producers/slack-archive-channel.producer';

describe('SlackArchiveChannelService', () => {
	let service: ArchiveChannelServiceInterface;
	let slackArchiveChannelProducer: DeepMocked<SlackArchiveChannelProducer>;

	const slackMessageType: ArchiveChannelData = {
		type: ArchiveChannelDataOptions.BOARD,
		data: { id: 'someId', slackChannelId: 'someSlackChannelId' }
	};

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackArchiveChannelService,
				{
					provide: SlackArchiveChannelProducer,
					useValue: createMock<SlackArchiveChannelProducer>()
				}
			]
		}).compile();

		service = module.get<SlackArchiveChannelService>(SlackArchiveChannelService);
		slackArchiveChannelProducer = module.get(SlackArchiveChannelProducer);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should call producer.send with SlackMessageType 1 time', async () => {
		await service.execute(slackMessageType);
		expect(slackArchiveChannelProducer.add).toHaveBeenNthCalledWith(1, slackMessageType);
	});
});

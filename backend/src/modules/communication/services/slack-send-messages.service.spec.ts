import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { SlackSendMessageService } from './slack-send-messages.service';
import { SlackSendMessageProducer } from '../producers/slack-send-message-channel.producer';
import { SlackMessageType } from '../dto/types';

describe('SlackSendMessageService', () => {
	let service: SlackSendMessageService;
	let slackSendMessageProducerMock: DeepMocked<SlackSendMessageProducer>;
	const slackMessageType: SlackMessageType = {
		slackChannelId: '6405f9a04633b1668f71c068',
		message: 'someMessage'
	};

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackSendMessageService,
				{
					provide: SlackSendMessageProducer,
					useValue: createMock<SlackSendMessageProducer>()
				}
			]
		}).compile();

		service = module.get<SlackSendMessageService>(SlackSendMessageService);
		slackSendMessageProducerMock = module.get(SlackSendMessageProducer);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should call producer.send with SlackMessageType 1 time', async () => {
		await service.execute(slackMessageType);
		expect(slackSendMessageProducerMock.send).toHaveBeenNthCalledWith(1, slackMessageType);
	});
});

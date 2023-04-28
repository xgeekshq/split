import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { SlackSendMessageService } from './slack-send-messages.service';
import { SlackSendMessageProducer } from '../producers/slack-send-message-channel.producer';
import { SlackMessageType } from '../dto/types';
import { SendMessageServiceInterface } from '../interfaces/send-message.service.interface';
import { SLACK_SEND_MESSAGE_SERVICE } from 'src/modules/communication/constants';

describe('SlackSendMessageService', () => {
	let service: SendMessageServiceInterface;
	let slackSendMessageProducerMock: DeepMocked<SlackSendMessageProducer>;
	const slackMessageType: SlackMessageType = {
		slackChannelId: '6405f9a04633b1668f71c068',
		message: 'someMessage'
	};

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: SLACK_SEND_MESSAGE_SERVICE,
					useClass: SlackSendMessageService
				},
				{
					provide: SlackSendMessageProducer,
					useValue: createMock<SlackSendMessageProducer>()
				}
			]
		}).compile();

		service = module.get(SLACK_SEND_MESSAGE_SERVICE);
		slackSendMessageProducerMock = module.get(SlackSendMessageProducer);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should call sendMessageProducer.send with SlackMessageType once', async () => {
		await service.execute(slackMessageType);
		expect(slackSendMessageProducerMock.send).toHaveBeenNthCalledWith(1, slackMessageType);
	});
});

import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { SlackSendMessageService } from './slack-send-messages.service';
import { SlackSendMessageProducer } from '../producers/slack-send-message-channel.producer';
import { SlackMessageType } from '../dto/types';
import { SendMessageServiceInterface } from '../interfaces/send-message.service.interface';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';

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
					provide: CommunicationsType.TYPES.services.SlackSendMessageService,
					useClass: SlackSendMessageService
				},
				{
					provide: SlackSendMessageProducer,
					useValue: createMock<SlackSendMessageProducer>()
				}
			]
		}).compile();

		service = module.get<SendMessageServiceInterface>(
			CommunicationsType.TYPES.services.SlackSendMessageService
		);
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

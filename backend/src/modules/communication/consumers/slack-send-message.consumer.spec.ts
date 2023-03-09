import { Test, TestingModule } from '@nestjs/testing';
import { SlackSendMessageApplication } from '../applications/slack-send-message-channel.application';
import { SlackSendMessageConsumer } from './slack-send-message.consumer';
import * as Communication from 'src/modules/communication/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { SlackMessageType } from 'src/modules/communication/dto/types';
import { Job } from 'bull';

const slackMessageMock = {
	id: 1,
	data: { slackChannelId: '6405f9a04633b1668f71c068', message: 'someMessage' }
};

describe('SlackSendMessageConsumer', () => {
	let consumer: SlackSendMessageConsumer;
	let sendMessageApplicationMock: DeepMocked<SlackSendMessageApplication>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackSendMessageConsumer,
				{
					provide: Communication.TYPES.application.SlackSendMessageApplication,
					useValue: createMock<SlackSendMessageApplication>()
				}
			]
		}).compile();
		consumer = module.get<SlackSendMessageConsumer>(SlackSendMessageConsumer);
		sendMessageApplicationMock = module.get(
			Communication.TYPES.application.SlackSendMessageApplication
		);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(consumer).toBeDefined();
	});

	it('should call sendMessageApplication execute', async () => {
		await consumer.communication(slackMessageMock as unknown as Job<SlackMessageType>);
		expect(sendMessageApplicationMock.execute).toHaveBeenCalledTimes(1);
	});
});

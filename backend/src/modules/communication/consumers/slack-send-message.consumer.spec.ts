import { Test, TestingModule } from '@nestjs/testing';
import { SlackSendMessageConsumer } from './slack-send-message.consumer';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { SlackMessageType } from 'src/modules/communication/dto/types';
import { Job } from 'bull';
import { SendMessageApplicationInterface } from '../interfaces/send-message.application.interface';
import { SLACK_SEND_MESSAGE_APPLICATION } from 'src/modules/communication/constants';

const slackMessageMock = {
	id: 1,
	data: { slackChannelId: '6405f9a04633b1668f71c068', message: 'someMessage' }
};

describe('SlackSendMessageConsumer', () => {
	let consumer: SlackSendMessageConsumer;
	let sendMessageApplicationMock: DeepMocked<SendMessageApplicationInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackSendMessageConsumer,
				{
					provide: SLACK_SEND_MESSAGE_APPLICATION,
					useValue: createMock<SendMessageApplicationInterface>()
				}
			]
		}).compile();
		consumer = module.get(SlackSendMessageConsumer);
		sendMessageApplicationMock = module.get(SLACK_SEND_MESSAGE_APPLICATION);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(consumer).toBeDefined();
	});

	it('should call application.execute once with job.data', async () => {
		await consumer.communication(slackMessageMock as unknown as Job<SlackMessageType>);
		expect(sendMessageApplicationMock.execute).toHaveBeenNthCalledWith(1, slackMessageMock.data);
	});
});

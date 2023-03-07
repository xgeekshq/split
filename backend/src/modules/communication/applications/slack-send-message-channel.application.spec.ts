import { ChatSlackHandler } from 'src/modules/communication/handlers/chat-slack.handler';
import { SlackCommunicationGateAdapter } from '../adapters/slack-communication-gate.adapter';
import { SlackSendMessageApplication } from './slack-send-message-channel.application';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'src/libs/constants/slack';
import { FRONTEND_URL } from 'src/libs/constants/frontend';

const getConfiguration = () => ({
	slackApiBotToken: configService.getOrThrow(SLACK_API_BOT_TOKEN),
	slackMasterChannelId: configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
	slackChannelPrefix: configService.getOrThrow(SLACK_CHANNEL_PREFIX),
	frontendUrl: configService.getOrThrow(FRONTEND_URL)
});
const slackMessageDtoMock = { slackChannelId: '6405f9a04633b1668f71c068', message: 'SlackMessage' };

describe('SlackSendMessageApplication', () => {
	let application: SlackSendMessageApplication;
	const communicationGateAdapterMocked = new SlackCommunicationGateAdapter(getConfiguration());
	const chatHandler = new ChatSlackHandler(communicationGateAdapterMocked);

	beforeAll(async () => {
		application = new SlackSendMessageApplication(chatHandler);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(application).toBeDefined();
	});

	it('shoult call postMessage', () => {
		const postMessage = jest.spyOn(chatHandler, 'postMessage').mockImplementation(jest.fn());
		application.execute(slackMessageDtoMock);
		expect(postMessage).toHaveBeenCalled();
	});

	it('should be called with SlackMessageDto', () => {
		const postMessage = jest.spyOn(chatHandler, 'postMessage').mockImplementationOnce(jest.fn());
		application.execute(slackMessageDtoMock);
		expect(postMessage).toHaveBeenCalledWith('6405f9a04633b1668f71c068', 'SlackMessage');
	});
});

import { ChatSlackHandler } from 'src/modules/communication/handlers/chat-slack.handler';
import { SlackCommunicationGateAdapter } from '../adapters/slack-communication-gate.adapter';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'src/libs/constants/slack';
import { FRONTEND_URL } from 'src/libs/constants/frontend';
import { ResponsibleApplicationInterface } from '../interfaces/responsible.application.interface';
import { UsersSlackHandler } from '../handlers/users-slack.handler';
import { ConversationsSlackHandler } from '../handlers/conversations-slack.handler';
import { SlackResponsibleApplication } from './slack-responsible.application';

const getConfiguration = () => ({
	slackApiBotToken: configService.getOrThrow(SLACK_API_BOT_TOKEN),
	slackMasterChannelId: configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
	slackChannelPrefix: configService.getOrThrow(SLACK_CHANNEL_PREFIX),
	frontendUrl: configService.getOrThrow(FRONTEND_URL)
});

describe('SlackResponsibleApplication', () => {
	let application: ResponsibleApplicationInterface;
	const communicationGateAdapterMocked = new SlackCommunicationGateAdapter(getConfiguration());
	const chatHandler = new ChatSlackHandler(communicationGateAdapterMocked);
	const userHandler = new UsersSlackHandler(communicationGateAdapterMocked);
	const conversationsHandler = new ConversationsSlackHandler(communicationGateAdapterMocked);
	//let postMessage;

	beforeAll(async () => {
		application = new SlackResponsibleApplication(chatHandler, userHandler, conversationsHandler);
		//postMessage = jest.spyOn(chatHandler, 'postMessage').mockImplementation(jest.fn());
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(application).toBeDefined();
	});
});

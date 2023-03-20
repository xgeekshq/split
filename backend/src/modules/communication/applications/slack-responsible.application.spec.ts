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

const changeResponsibleMock = {
	newResponsibleEmail: 'someEmail',
	previousResponsibleEmail: 'someEmail',
	subTeamChannelId: 'someId',
	email: 'someEmail',
	teamNumber: 1,
	responsiblesChannelId: 'someId',
	mainChannelId: 'someChannelId'
};

describe('SlackResponsibleApplication', () => {
	let application: ResponsibleApplicationInterface;
	const communicationGateAdapterMocked = new SlackCommunicationGateAdapter(getConfiguration());
	const chatHandler = new ChatSlackHandler(communicationGateAdapterMocked);
	const userHandler = new UsersSlackHandler(communicationGateAdapterMocked);
	const conversationsHandler = new ConversationsSlackHandler(communicationGateAdapterMocked);
	let postMessage;
	let userHandlerMock;
	let conversationsHandlerMock;

	beforeAll(async () => {
		application = new SlackResponsibleApplication(chatHandler, userHandler, conversationsHandler);

		postMessage = jest.spyOn(chatHandler, 'postMessage').mockImplementation(jest.fn());
		userHandlerMock = jest
			.spyOn(userHandler, 'getSlackUserIdByEmail')
			.mockResolvedValue('newResponsibleId');

		conversationsHandlerMock = jest
			.spyOn(conversationsHandler, 'inviteUserToChannel')
			.mockImplementation(jest.fn());
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(application).toBeDefined();
	});

	it('should call userHandler.getSlackUserIdByEmail once with newResponsibleEmail ', async () => {
		await application.execute(changeResponsibleMock);
		expect(userHandlerMock).toHaveBeenNthCalledWith(1, changeResponsibleMock.newResponsibleEmail);
	});

	it('should call postMessage if mainChannelId', async () => {
		await application.execute(changeResponsibleMock);
		expect(postMessage).toHaveBeenCalledWith(
			changeResponsibleMock.mainChannelId,
			expect.stringContaining('newResponsibleId')
		);
	});

	it('should call conversationHandler.inviteUserToChannel', async () => {
		await application.execute(changeResponsibleMock);
		expect(conversationsHandlerMock).toHaveBeenCalledWith(
			changeResponsibleMock.responsiblesChannelId,
			'newResponsibleId'
		);
	});

	it('should call postMessage if has responsibleChannelId', async () => {
		await application.execute(changeResponsibleMock);
		expect(postMessage).toHaveBeenCalledWith(
			changeResponsibleMock.responsiblesChannelId,
			expect.stringContaining('newResponsibleId')
		);
	});

	it('should call postMessage with subTeamChannelId and message', async () => {
		await application.execute(changeResponsibleMock);
		expect(postMessage).toHaveBeenCalledWith(
			changeResponsibleMock.subTeamChannelId,
			expect.stringContaining('newResponsibleId')
		);
	});
});

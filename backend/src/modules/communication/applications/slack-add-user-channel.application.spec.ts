import { SlackCommunicationGateAdapter } from '../adapters/slack-communication-gate.adapter';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'src/libs/constants/slack';
import { FRONTEND_URL } from 'src/libs/constants/frontend';
import { SlackAddUserIntoChannelApplication } from './slack-add-user-channel.application';
import { AddUserIntoChannelApplicationInterface } from '../interfaces/communication.application.interface copy';
import { UsersSlackHandler } from '../handlers/users-slack.handler';
import { ConversationsSlackHandler } from '../handlers/conversations-slack.handler';

const getConfiguration = () => ({
	slackApiBotToken: configService.getOrThrow(SLACK_API_BOT_TOKEN),
	slackMasterChannelId: configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
	slackChannelPrefix: configService.getOrThrow(SLACK_CHANNEL_PREFIX),
	frontendUrl: configService.getOrThrow(FRONTEND_URL)
});

const emailMock = 'someEmail';

describe('SlackAddUserIntoChannelApplication', () => {
	let application: AddUserIntoChannelApplicationInterface;
	const communicationGateAdapterMocked = new SlackCommunicationGateAdapter(getConfiguration());
	const userHandler = new UsersSlackHandler(communicationGateAdapterMocked);
	const conversationsHandler = new ConversationsSlackHandler(communicationGateAdapterMocked);

	let userHandlerMock;

	beforeAll(async () => {
		application = new SlackAddUserIntoChannelApplication(
			getConfiguration(),
			conversationsHandler,
			userHandler
		);
		userHandlerMock = jest
			.spyOn(userHandler, 'getSlackUserIdByEmail')
			.mockImplementation(jest.fn())
			.mockResolvedValue('someUserId');

		jest
			.spyOn(conversationsHandler, 'inviteUserToChannel')
			.mockImplementation(jest.fn())
			.mockResolvedValue({ ok: true, channelId: 'someChannelId' });
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(application).toBeDefined();
	});

	describe('execute', () => {
		it('should return true when SlackAddUserIntoChannelApplication is successful', async () => {
			await expect(application.execute(emailMock)).resolves.toBe(true);
		});

		it('should return false if an error occurs', async () => {
			userHandlerMock.mockRejectedValueOnce(new Error('Some error'));
			await expect(application.execute(emailMock)).resolves.toBe(false);
		});
	});
});

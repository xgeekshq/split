import { ChatSlackHandler } from 'src/modules/communication/handlers/chat-slack.handler';
import { SlackCommunicationGateAdapter } from '../adapters/slack-communication-gate.adapter';
import { SlackMergeBoardApplication } from './slack-merge-board.application';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'src/libs/constants/slack';
import { FRONTEND_URL } from 'src/libs/constants/frontend';
import { MergeBoardApplicationInterface } from '../interfaces/merge-board.application.interface';

const getConfiguration = () => ({
	slackApiBotToken: configService.getOrThrow(SLACK_API_BOT_TOKEN),
	slackMasterChannelId: configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
	slackChannelPrefix: configService.getOrThrow(SLACK_CHANNEL_PREFIX),
	frontendUrl: configService.getOrThrow(FRONTEND_URL)
});

const mergeBoardMock = {
	teamNumber: 1,
	responsiblesChannelId: 'someChannel',
	isLastSubBoard: true,
	boardId: 'someId',
	mainBoardId: 'someId'
};

describe('SlackSendMessageApplication', () => {
	let application: MergeBoardApplicationInterface;
	const communicationGateAdapterMocked = new SlackCommunicationGateAdapter(getConfiguration());
	const chatHandler = new ChatSlackHandler(communicationGateAdapterMocked);
	let postMessage;

	beforeAll(async () => {
		application = new SlackMergeBoardApplication(
			chatHandler,
			configService.getOrThrow(FRONTEND_URL)
		);
		postMessage = jest.spyOn(chatHandler, 'postMessage').mockImplementation(jest.fn());
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(application).toBeDefined();
	});

	describe('execute', () => {
		it('should call chatHandler.postMessage once with responsibleChannelId and message with teamNumber', async () => {
			await application.execute(mergeBoardMock);
			expect(postMessage).toHaveBeenNthCalledWith(
				1,
				mergeBoardMock.responsiblesChannelId,
				expect.stringContaining(mergeBoardMock.teamNumber.toString())
			);
		});

		it('should call chatHandler.postMessage two if isLastSubBoard equal to true', async () => {
			await application.execute(mergeBoardMock);
			expect(postMessage).toHaveBeenNthCalledWith(
				2,
				mergeBoardMock.responsiblesChannelId,
				expect.stringContaining(configService.getOrThrow(FRONTEND_URL))
			);
		});
		it('should not call second postMessage when isLastSubBoard equal to false', async () => {
			mergeBoardMock.isLastSubBoard = false;
			await application.execute(mergeBoardMock);
			expect(postMessage).toHaveBeenCalledTimes(1);
		});
	});
});

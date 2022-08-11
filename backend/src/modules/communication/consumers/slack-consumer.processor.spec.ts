import { Logger } from '@nestjs/common';
import Bull from 'bull';

import { FRONTEND_URL } from 'libs/constants/frontend';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'libs/constants/slack';
import configService from 'libs/test-utils/mocks/configService.mock';
import { SlackExecuteCommunication } from 'modules/communication/applications/slack-execute-communication.application';
import consumer from 'modules/communication/consumers/slack-consumer.processor';
import { TeamDto } from 'modules/communication/dto/team.dto';
import { BoardType, JobType } from 'modules/communication/dto/types';

jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn);
jest.spyOn(Logger.prototype, 'verbose').mockImplementation(jest.fn);

jest.mock('modules/communication/adapters/slack-communication-gate.adapter');
jest.mock('modules/communication/handlers/chat-slack.handler');
jest.mock('modules/communication/handlers/conversations-slack.handler');
jest.mock('modules/communication/handlers/users-slack.handler');

const getConfiguration = () => ({
	slackApiBotToken: configService.getOrThrow(SLACK_API_BOT_TOKEN),
	slackMasterChannelId: configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
	slackChannelPrefix: configService.getOrThrow(SLACK_CHANNEL_PREFIX),
	frontendUrl: configService.getOrThrow(FRONTEND_URL)
});

describe('Slack consumer processor', () => {
	it('should call application.execute', async () => {
		const givenBoard: BoardType = {} as BoardType;
		const cbMocked = jest.fn();
		const spy = jest
			.spyOn(SlackExecuteCommunication.prototype, 'execute')
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.mockImplementationOnce((_board: BoardType): Promise<TeamDto[]> => {
				return Promise.resolve([]);
			});

		consumer(
			{
				data: {
					board: givenBoard,
					config: getConfiguration()
				}
			} as unknown as Bull.Job<JobType>,
			cbMocked
		);

		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});
});

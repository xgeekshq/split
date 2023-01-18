import { Logger } from '@nestjs/common';
import { FRONTEND_URL } from 'src/libs/constants/frontend';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'src/libs/constants/slack';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import { SlackCommunicationGateAdapter } from 'src/modules/communication/adapters/slack-communication-gate.adapter';
import { SlackArchiveChannelApplication } from 'src/modules/communication/applications/slack-archive-channel.application';
import {
	ArchiveChannelData,
	ArchiveChannelDataOptions,
	PartialBoardType
} from 'src/modules/communication/dto/types';
import { ConversationsSlackHandler } from 'src/modules/communication/handlers/conversations-slack.handler';

const slackChannel = {
	U023BECGF: { archived: false, shouldThrowsError: false },
	U061F7AUR: { archived: false, shouldThrowsError: false },
	W012A3CDE: { archived: false, shouldThrowsError: false },
	U678BAAGC: { archived: false, shouldThrowsError: false },
	U160F7AUZ: { archived: false, shouldThrowsError: false },
	U156F7AOI: { archived: false, shouldThrowsError: false },
	W058A3SDQ: { archived: true, shouldThrowsError: false },
	W013A3CEF: { archived: true, shouldThrowsError: true },
	U111BAXFL: { archived: false, shouldThrowsError: true }
};
jest.mock('@slack/web-api', () => ({
	WebClient: function WebClient() {
		return {
			conversations: {
				archive(data: { channel: string }) {
					const channel = slackChannel[data.channel];

					if (!channel) return Promise.reject({ data: { ok: false, error: 'channel_not_found' } });

					if (channel.shouldThrowsError) return Promise.reject(new Error('some_error'));

					if (channel.archived)
						return Promise.reject({ data: { ok: false, error: 'already_archived' } });

					return Promise.resolve({ ok: true });
				}
			}
		};
	}
}));

jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn);
jest.spyOn(Logger.prototype, 'verbose').mockImplementation(jest.fn);

const getConfiguration = () => ({
	slackApiBotToken: configService.getOrThrow(SLACK_API_BOT_TOKEN),
	slackMasterChannelId: configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
	slackChannelPrefix: configService.getOrThrow(SLACK_CHANNEL_PREFIX),
	frontendUrl: configService.getOrThrow(FRONTEND_URL)
});

describe('SlackArchiveChannelApplication', () => {
	let application: SlackArchiveChannelApplication;
	const communicationGateAdapterMocked = new SlackCommunicationGateAdapter(getConfiguration());

	beforeAll(async () => {
		application = new SlackArchiveChannelApplication(
			new ConversationsSlackHandler(communicationGateAdapterMocked)
		);
	});

	it('should be defined', () => {
		expect(application).toBeDefined();
	});

	it('should archive channel by channel id', async () => {
		const archiveChannelData: ArchiveChannelData = {
			type: ArchiveChannelDataOptions.CHANNEL_ID,
			data: 'U023BECGF'
		};

		const result = await application.execute(archiveChannelData);

		expect(result).toMatchObject([{ channelId: archiveChannelData.data, result: true }]);
	});

	it('should returns "ok" if the channel is already archived', async () => {
		const archiveChannelData: ArchiveChannelData = {
			type: ArchiveChannelDataOptions.CHANNEL_ID,
			data: 'W058A3SDQ'
		};

		const result = await application.execute(archiveChannelData);

		expect(result).toMatchObject([{ channelId: archiveChannelData.data, result: true }]);
	});

	it('should returns "result" as false if the response from slack returns an error', async () => {
		const archiveChannelData: ArchiveChannelData = {
			type: ArchiveChannelDataOptions.CHANNEL_ID,
			data: 'Do_not_exists'
		};

		const result = await application.execute(archiveChannelData);

		expect(result).toMatchObject([{ channelId: archiveChannelData.data, result: false }]);
	});

	it('should throws "ArchiveChannelError" if an error occurs', async () => {
		const archiveChannelData: ArchiveChannelData = {
			type: ArchiveChannelDataOptions.CHANNEL_ID,
			data: 'U111BAXFL'
		};

		await expect(application.execute(archiveChannelData)).rejects.toThrowError();
	});

	it('should archive channel by board', async () => {
		const archiveChannelData: ArchiveChannelData = {
			type: ArchiveChannelDataOptions.BOARD,
			data: { id: 'any_board_id', slackChannelId: 'U023BECGF' }
		};

		const result = await application.execute(archiveChannelData);

		expect(result).toMatchObject([
			{ channelId: (archiveChannelData.data as PartialBoardType).slackChannelId, result: true }
		]);
	});

	it('should archive all channels by board with dividedBoards if "cascade" is set to true', async () => {
		const archiveChannelData: ArchiveChannelData = {
			type: ArchiveChannelDataOptions.BOARD,
			cascade: true,
			data: {
				id: 'any_board_id',
				slackChannelId: 'not_exists',
				dividedBoards: Object.entries(slackChannel).map(([k], idx) => ({
					id: `any_board_id_${idx}`,
					slackChannelId: k
				}))
			}
		};

		const result = await application.execute(archiveChannelData);

		expect(result).toMatchObject([
			{ channelId: 'not_exists', result: false },
			{ channelId: 'U023BECGF', result: true },
			{ channelId: 'U061F7AUR', result: true },
			{ channelId: 'W012A3CDE', result: true },
			{ channelId: 'U678BAAGC', result: true },
			{ channelId: 'U160F7AUZ', result: true },
			{ channelId: 'U156F7AOI', result: true },
			{ channelId: 'W058A3SDQ', result: true },
			{ channelId: 'W013A3CEF', result: 'Archive channel fails' },
			{ channelId: 'U111BAXFL', result: 'Archive channel fails' }
		]);
	});
});

import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import * as WebClientSlackApi from '@slack/web-api';
import {
	ChatMeMessageArguments,
	ConversationsArchiveArguments,
	ConversationsCreateArguments,
	ConversationsInviteArguments,
	ConversationsMembersArguments,
	UsersProfileGetArguments
} from '@slack/web-api';
import { FRONTEND_URL } from 'src/libs/constants/frontend';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'src/libs/constants/slack';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import { ArchiveChannelError } from 'src/modules/communication/errors/archive-channel.error';
import { CreateChannelError } from 'src/modules/communication/errors/create-channel.error';
import { GetProfileError } from 'src/modules/communication/errors/get-profile.error';
import { GetUsersFromChannelError } from 'src/modules/communication/errors/get-users-from-channel.error';
import { InviteUsersError } from 'src/modules/communication/errors/invite-users.error';
import { ProfileNotFoundError } from 'src/modules/communication/errors/profile-not-found.error';
import { ProfileWithoutEmailError } from 'src/modules/communication/errors/profile-without-email.error';
import { SlackCommunicationGateAdapter } from './slack-communication-gate.adapter';

const slackUsersIds = ['U023BECGF', 'U061F7AUR', 'W012A3CDE'];
jest.mock('@slack/web-api', () => ({
	// eslint-disable-next-line object-shorthand
	WebClient: function WebClient() {
		return {
			conversations: {
				archive(_options?: ConversationsArchiveArguments) {
					return Promise.resolve({
						ok: true
					});
				},
				create(options?: ConversationsCreateArguments) {
					return Promise.resolve({
						ok: true,
						channel: {
							id: `C${faker.string.alphanumeric(8).toUpperCase()}`,
							name: options?.name
						}
					});
				},
				invite(options?: ConversationsInviteArguments) {
					return new Promise((resolve, reject) => {
						if (options?.users?.split(',').every((i) => slackUsersIds.includes(i))) {
							resolve({
								ok: true,
								channel: {
									id: options?.channel
								}
							});
						}

						const dataError = {
							ok: false,
							errors: options?.users
								.split(',')
								.filter((i) => !(slackUsersIds.findIndex((j) => i === j) > -1))
								.map((i) => ({
									user: i,
									ok: false,
									error: 'any_error'
								}))
						};

						// eslint-disable-next-line prefer-promise-reject-errors
						reject({
							data: dataError
						});
					});
				},
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				members(options?: ConversationsMembersArguments) {
					if (options?.cursor === 'next_cursor') {
						return Promise.resolve({
							ok: true,
							members: slackUsersIds.slice(1),
							response_metadata: {
								next_cursor: null
							}
						});
					}

					return Promise.resolve({
						ok: true,
						members: slackUsersIds.slice(0, 1),
						response_metadata: {
							next_cursor: 'next_cursor' // 'e3VzZXJfaWQ6IFcxMjM0NTY3fQ==',
						}
					});
				}
			},
			users: {
				profile: {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					get(options?: UsersProfileGetArguments) {
						if (options?.user === 'user_exists_without_email') {
							return Promise.resolve({
								ok: true,
								profile: {
									email: undefined
								}
							});
						}

						const userId = slackUsersIds.find((i) => i === options?.user);

						return Promise.resolve({
							ok: true,
							...(userId
								? {
										profile: {
											email: `${userId}@email.com`
										}
									}
								: null)
						});
					}
				}
			},
			chat: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				postMessage(options?: ChatMeMessageArguments) {
					return Promise.resolve({
						ok: true,
						channel: options?.channel
					});
				}
			}
		};
	}
}));

const getConfiguration = () => ({
	slackApiBotToken: configService.get(SLACK_API_BOT_TOKEN),
	slackMasterChannelId: configService.get(SLACK_MASTER_CHANNEL_ID),
	slackChannelPrefix: configService.get(SLACK_CHANNEL_PREFIX),
	frontendUrl: configService.get(FRONTEND_URL)
});

describe('SlackCommunicationGateAdapter', () => {
	let adapter: SlackCommunicationGateAdapter;

	beforeAll(async () => {
		jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
		jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn);
		jest.spyOn(Logger.prototype, 'verbose').mockImplementation(jest.fn);

		adapter = new SlackCommunicationGateAdapter(getConfiguration());
	});

	it('should be defined', () => {
		expect(adapter).toBeDefined();
	});

	it('should create a slack channel and return its id', async () => {
		const input = 'test';
		const { id, name } = await adapter.addChannel(input);

		expect(id.startsWith('C')).toBe(true);
		expect(name).toBe('test');
	});

	it('should archive a slack channel and return ok', async () => {
		const input = 'test';
		const { ok } = await adapter.archive(input);

		expect(ok).toBe(true);
	});

	it('should add users to a channel', async () => {
		const channelId = 'C_any_id';

		const result = await adapter.addUsersToChannel(channelId, slackUsersIds);

		expect(result).toMatchObject({ ok: true });
	});

	it('should add valid users to a channel and return users ids that fails', async () => {
		const channelId = 'C_any_id';
		const userIdToFails = 'any_user_id';

		const result = await adapter.addUsersToChannel(channelId, [...slackUsersIds, userIdToFails]);

		expect(result).toMatchObject({ ok: false });
		expect(result.fails).toMatchObject([userIdToFails]);
	});

	it('should get all members from a channel by channel id', async () => {
		const channelId = 'C_any_id';

		const result = await adapter.getAllUsersByChannel(channelId);

		expect(result).toMatchObject(slackUsersIds);
	});

	it('should get email by user id', async () => {
		const [userId] = slackUsersIds.slice(0, 1);

		const result = await adapter.getEmailByUserId(userId);

		expect(result).toBe(`${userId}@email.com`);
	});

	it('should throw "ProfileNotFoundError" if api return success but wihout a profile', async () => {
		const userId = 'any_user_id';

		await expect(adapter.getEmailByUserId(userId)).rejects.toThrowError(ProfileNotFoundError);
	});

	it('should throw "ProfileWithoutEmailError" if api return success but wihout an email inside user\'s profile', async () => {
		const userId = 'user_exists_without_email';

		await expect(adapter.getEmailByUserId(userId)).rejects.toThrowError(ProfileWithoutEmailError);
	});

	it('should add message to a channel', async () => {
		const channelId = 'any_channel_id';
		const message = 'any_message';

		const result = await adapter.addMessageToChannel(channelId, message);

		expect(result).toMatchObject({ ok: true, ts: undefined });
	});

	describe('- throw Errors if "@slack/web-api" throws error', () => {
		let adapterWithErrors: SlackCommunicationGateAdapter;

		const WebClientMockError: any = function WebClient() {
			return {
				conversations: {
					archive(_options?: ConversationsArchiveArguments) {
						return Promise.reject(new Error('some error message'));
					},
					create(_options?: ConversationsCreateArguments) {
						return Promise.reject(new Error('some error message'));
					},
					invite(_options?: ConversationsInviteArguments) {
						return Promise.reject(new Error('some error message'));
					},
					members(_options?: ConversationsMembersArguments) {
						return Promise.reject(new Error('some error message'));
					}
				},
				users: {
					profile: {
						get(_options?: UsersProfileGetArguments) {
							return Promise.reject(new Error('some error message'));
						}
					}
				},
				chat: {
					postMessage(_options?: ChatMeMessageArguments) {
						return Promise.reject(new Error('some error message'));
					}
				}
			};
		};

		const LoggerErrorMock = jest.fn();

		beforeAll(() => {
			jest.spyOn(WebClientSlackApi, 'WebClient').mockImplementationOnce(WebClientMockError);
			jest.spyOn(Logger.prototype, 'error').mockImplementation(LoggerErrorMock);
			jest.spyOn(Logger.prototype, 'verbose').mockImplementation(jest.fn);

			adapterWithErrors = new SlackCommunicationGateAdapter(getConfiguration());
		});

		afterEach(() => {
			LoggerErrorMock.mockRestore();
		});

		it('should throw "ArchiveChannelError" when call "archive"', async () => {
			const input = 'test';

			await expect(adapterWithErrors.archive(input)).rejects.toThrowError(ArchiveChannelError);
			expect(LoggerErrorMock).toBeCalledTimes(1);
		});

		it('should throw "CreateChannelError" when call "addChannel"', async () => {
			const input = 'test';

			await expect(adapterWithErrors.addChannel(input)).rejects.toThrowError(CreateChannelError);
			expect(LoggerErrorMock).toBeCalledTimes(1);
		});

		it('should throw "InviteUsersError" when call "addUsersToChannel" ', async () => {
			const channelId = 'C_any_id';

			await expect(
				adapterWithErrors.addUsersToChannel(channelId, slackUsersIds)
			).rejects.toThrowError(InviteUsersError);
			expect(LoggerErrorMock).toBeCalledTimes(1);
		});

		it('should throw "GetUsersFromChannelError" when call "getAllUsersByChannel" ', async () => {
			const channelId = 'C_any_id';

			await expect(adapterWithErrors.getAllUsersByChannel(channelId)).rejects.toThrowError(
				GetUsersFromChannelError
			);
			expect(LoggerErrorMock).toBeCalledTimes(1);
		});

		it('should throw "GetProfileError" when call "getEmailByUserId"', async () => {
			const [userId] = slackUsersIds.slice(0, 1);

			await expect(adapterWithErrors.getEmailByUserId(userId)).rejects.toThrowError(
				GetProfileError
			);
			expect(LoggerErrorMock).toBeCalledTimes(1);
		});
	});
});

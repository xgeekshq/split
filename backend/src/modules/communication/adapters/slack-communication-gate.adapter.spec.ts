import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import * as WebClientSlackApi from '@slack/web-api';
import {
	ChatMeMessageArguments,
	ConversationsCreateArguments,
	ConversationsInviteArguments,
	ConversationsMembersArguments,
	UsersProfileGetArguments
} from '@slack/web-api';

import { FRONTEND_URL } from 'libs/constants/frontend';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'libs/constants/slack';
import configService from 'libs/test-utils/mocks/configService.mock';
import { CreateChannelError } from 'modules/communication/errors/create-channel.error';
import { GetProfileError } from 'modules/communication/errors/get-profile.error';
import { GetUsersFromChannelError } from 'modules/communication/errors/get-users-from-channel.error';
import { InviteUsersError } from 'modules/communication/errors/invite-users.error';
import { PostMessageError } from 'modules/communication/errors/post-message.error';
import { ProfileNotFoundError } from 'modules/communication/errors/profile-not-found.error';
import { ProfileWithoutEmailError } from 'modules/communication/errors/profile-without-email.error';

import { SlackCommunicationGateAdapter } from './slack-communication-gate.adapter';

const slackUsersIds = ['U023BECGF', 'U061F7AUR', 'W012A3CDE'];
jest.mock('@slack/web-api', () => ({
	// eslint-disable-next-line object-shorthand
	WebClient: function WebClient() {
		return {
			conversations: {
				create(options?: ConversationsCreateArguments | undefined) {
					return Promise.resolve({
						ok: true,
						channel: {
							id: `C${faker.random.alphaNumeric(8).toUpperCase()}`,
							name: options?.name
						}
					});
				},
				invite(options?: ConversationsInviteArguments | undefined) {
					return new Promise((resolve, reject) => {
						if (options?.users?.split(',').every((i) => slackUsersIds.includes(i))) {
							resolve({
								ok: true,
								channel: {
									id: options?.channelId
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
				members(options?: ConversationsMembersArguments | undefined) {
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
					get(options?: UsersProfileGetArguments | undefined) {
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
				postMessage(options?: ChatMeMessageArguments | undefined) {
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
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					create(options?: ConversationsCreateArguments | undefined) {
						return Promise.reject(new Error('some error message'));
					},
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					invite(options?: ConversationsInviteArguments | undefined) {
						return Promise.reject(new Error('some error message'));
					},
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					members(options?: ConversationsMembersArguments | undefined) {
						return Promise.reject(new Error('some error message'));
					}
				},
				users: {
					profile: {
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						get(options?: UsersProfileGetArguments | undefined) {
							return Promise.reject(new Error('some error message'));
						}
					}
				},
				chat: {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					postMessage(options?: ChatMeMessageArguments | undefined) {
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

		it('should throw "PostMessageError" when call "addMessageToChannel"', async () => {
			const channelId = 'any_channel_id';
			const message = 'any_message';

			await expect(adapterWithErrors.addMessageToChannel(channelId, message)).rejects.toThrowError(
				PostMessageError
			);
			expect(LoggerErrorMock).toBeCalledTimes(1);
		});
	});
});

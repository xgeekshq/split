import { Logger } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

import { ConfigurationType } from 'modules/communication/dto/types';
import { CreateChannelError } from 'modules/communication/errors/create-channel.error';
import { GetProfileError } from 'modules/communication/errors/get-profile.error';
import { GetUsersFromChannelError } from 'modules/communication/errors/get-users-from-channel.error';
import { InviteUsersError } from 'modules/communication/errors/invite-users.error';
import { PostMessageError } from 'modules/communication/errors/post-message.error';
import { ProfileNotFoundError } from 'modules/communication/errors/profile-not-found.error';
import { ProfileWithoutEmailError } from 'modules/communication/errors/profile-without-email.error';
import { CommunicationGateInterface } from 'modules/communication/interfaces/communication-gate.interface';

import { ProfileWithoutIdError } from '../errors/profile-without-id.error';

export class SlackCommunicationGateAdapter implements CommunicationGateInterface {
	private logger = new Logger(SlackCommunicationGateAdapter.name);

	private client: WebClient;

	constructor(private readonly config: ConfigurationType) {
		this.client = new WebClient(this.config.slackApiBotToken);

		this.logger.verbose('@slack/web-api client created');
	}

	private getClient(): WebClient {
		return this.client;
	}

	public async addChannel(name: string): Promise<{ id: string; name: string }> {
		try {
			// https://api.slack.com/methods/conversations.create  (!! 20+ per minute)
			const { channel } = await this.getClient().conversations.create({
				name
			});

			return {
				id: channel?.id || '0',
				name: channel?.name || ''
			};
		} catch (error) {
			this.logger.error(error);
			throw new CreateChannelError();
		}
	}

	public async addUsersToChannel(
		channelId: string,
		usersIds: string[]
	): Promise<{ ok: boolean; fails?: string[] }> {
		try {
			// https://api.slack.com/methods/conversations.invite (!! 50+ per minute)
			const { ok } = await this.getClient().conversations.invite({
				channel: channelId,
				users: usersIds.join(',')
			});

			return { ok };
		} catch (error) {
			if (typeof error.data?.ok === 'boolean' && !error.data?.ok) {
				this.logger.warn(error);
				const failUsersIds = error.data.errors.map((i) => i.user);

				return { ok: error.data.ok, fails: failUsersIds };
			}
			this.logger.error(error);
			throw new InviteUsersError();
		}
	}

	public async getAllUsersByChannel(channelId: string): Promise<string[]> {
		try {
			let cursor;
			const users: string[] = [];
			do {
				// https://api.slack.com/methods/conversations.members (!! 100+ per minute)
				const result =
					// eslint-disable-next-line no-await-in-loop
					await this.getClient().conversations.members({
						channel: channelId,
						cursor
					});

				users.push(...(result.members ?? []));
				cursor = result.response_metadata?.next_cursor;
			} while (cursor);

			return users;
		} catch (error) {
			this.logger.error(error);
			throw new GetUsersFromChannelError();
		}
	}

	public async getEmailByUserId(userId: string): Promise<string> {
		try {
			// https://api.slack.com/methods/users.profile.get (!! 100+ per minute)
			const { profile } = await this.getClient().users.profile.get({
				user: userId
			});

			if (!profile) {
				throw new ProfileNotFoundError();
			}

			if (!profile.email) {
				throw new ProfileWithoutEmailError();
			}

			return profile.email;
		} catch (error) {
			this.logger.error(error);
			if (error instanceof ProfileNotFoundError || error instanceof ProfileWithoutEmailError) {
				throw error;
			}

			throw new GetProfileError();
		}
	}

	public async getEmailByPlatformUserId(email: string): Promise<string> {
		try {
			// https://api.slack.com/methods/users.profile.get (!! 100+ per minute)
			const { user } = await this.getClient().users.lookupByEmail({ email });

			if (!user) {
				throw new ProfileNotFoundError();
			}

			if (!user.id) {
				throw new ProfileWithoutIdError();
			}

			return user.id;
		} catch (error) {
			this.logger.error(error);
			if (error instanceof ProfileNotFoundError || error instanceof ProfileWithoutEmailError) {
				throw error;
			}

			throw new GetProfileError();
		}
	}

	public async addMessageToChannel(
		channelId: string,
		message: string,
		timeStamp?: string
	): Promise<{ ok: boolean; ts?: string }> {
		try {
			// https://api.slack.com/methods/chat.postMessage
			const { ok, ts } = await this.getClient().chat.postMessage({
				channel: channelId,
				text: message,
				thread_ts: timeStamp
			});

			return { ok, ts };
		} catch (error) {
			this.logger.error(error);
			throw new PostMessageError();
		}
	}
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { ChatSlackHandler } from 'modules/communication/handlers/chat-slack.handler';
import { CommunicationGateInterface } from 'modules/communication/interfaces/communication-gate.interface';

const MakeSlackCommunicationGateAdapterStub = () => {
	class SlackCommunicationGateAdapterStub implements CommunicationGateInterface {
		getEmailByPlatformUserId(email: string): Promise<string> {
			throw new Error('Method not implemented.');
		}
		addChannel(name: string): Promise<{ id: string; name: string }> {
			throw new Error('Method not implemented.');
		}
		addUsersToChannel(
			channelId: string,
			usersIds: string[]
		): Promise<{ ok: boolean; fails?: string[] | undefined }> {
			throw new Error('Method not implemented.');
		}
		getAllUsersByChannel(channelId: string): Promise<string[]> {
			throw new Error('Method not implemented.');
		}
		getEmailByUserId(userId: string): Promise<string> {
			throw new Error('Method not implemented.');
		}
		addMessageToChannel(channelId: string, message: string): Promise<{ ok: boolean }> {
			return Promise.resolve({ ok: true });
		}
	}
	return new SlackCommunicationGateAdapterStub();
};

describe('ChatSlackHandler', () => {
	let handler: ChatSlackHandler;
	const slackCommunicationGateAdapterStub = MakeSlackCommunicationGateAdapterStub();

	beforeAll(async () => {
		handler = new ChatSlackHandler(slackCommunicationGateAdapterStub);
	});

	it('should be defined', () => {
		expect(handler).toBeDefined();
	});

	it('should post a message by channel id', async () => {
		const channelId = 'any_channel_id';
		const message = 'any_message';

		const spy = jest.spyOn(slackCommunicationGateAdapterStub, 'addMessageToChannel');

		const result = await handler.postMessage(channelId, message);

		expect(result).toMatchObject({ ok: true, channel: 'any_channel_id' });
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});

	it('should throw error when adapter throws', async () => {
		const channelId = 'any_channel_id';
		const message = 'any_message';

		const spy = jest
			.spyOn(slackCommunicationGateAdapterStub, 'addMessageToChannel')
			.mockImplementation(() => Promise.reject(new Error('some error')));

		await expect(handler.postMessage(channelId, message)).rejects.toThrowError();
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});
});

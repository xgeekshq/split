/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { UsersSlackHandler } from 'src/modules/communication/handlers/users-slack.handler';
import { CommunicationGateAdapterInterface } from 'src/modules/communication/interfaces/communication-gate.adapter.interface';

const MakeSlackCommunicationGateAdapterStub = () => {
	class SlackCommunicationGateAdapterStub implements CommunicationGateAdapterInterface {
		archive(channelId: string): Promise<{ ok: boolean; error?: string }> {
			throw new Error('Method not implemented.');
		}
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
			return Promise.resolve('any_email');
		}
		addMessageToChannel(channelId: string, message: string): Promise<{ ok: boolean }> {
			throw new Error('Method not implemented.');
		}
	}

	return new SlackCommunicationGateAdapterStub();
};

describe('UsersSlackHandler', () => {
	let handler: UsersSlackHandler;
	const slackCommunicationGateAdapterStub = MakeSlackCommunicationGateAdapterStub();

	beforeAll(async () => {
		handler = new UsersSlackHandler(slackCommunicationGateAdapterStub);
	});

	it('should be defined', () => {
		expect(handler).toBeDefined();
	});

	it('should get users profiles by ids', async () => {
		const usersIds = ['any_user_id'];

		const spy = jest.spyOn(slackCommunicationGateAdapterStub, 'getEmailByUserId');

		const result = await handler.getProfilesByIds(usersIds);

		expect(result).toBeInstanceOf(Array);
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});

	it('should not throw error when adapter throws', async () => {
		const usersIds = ['any_user_id'];

		const spy = jest
			.spyOn(slackCommunicationGateAdapterStub, 'getEmailByUserId')
			.mockImplementation(() => Promise.reject(new Error('some error')));

		const result = await handler.getProfilesByIds(usersIds);

		expect(result).toBeInstanceOf(Array);
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});
});

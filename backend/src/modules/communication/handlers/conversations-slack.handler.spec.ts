import { UserDto } from 'src/modules/communication/dto/user.dto';
import { ConversationsSlackHandler } from 'src/modules/communication/handlers/conversations-slack.handler';
import { CommunicationGateAdapterInterface } from 'src/modules/communication/interfaces/communication-gate.adapter.interface';

const MakeSlackCommunicationGateAdapterStub = () => {
	class SlackCommunicationGateAdapterStub implements CommunicationGateAdapterInterface {
		archive(_channelId: string): Promise<{ ok: boolean; error?: string }> {
			return Promise.resolve({ ok: true });
		}
		getEmailByPlatformUserId(_email: string): Promise<string> {
			throw new Error('Method not implemented.');
		}
		addChannel(name: string): Promise<{ id: string; name: string }> {
			return Promise.resolve({ id: 'any_id', name });
		}
		addUsersToChannel(
			_channelId: string,
			_usersIds: string[]
		): Promise<{ ok: boolean; fails?: string[] | undefined }> {
			return Promise.resolve({ ok: true });
		}
		getAllUsersByChannel(_channelId: string): Promise<string[]> {
			return Promise.resolve(['any_user_id']);
		}
		getEmailByUserId(_userId: string): Promise<string> {
			throw new Error('Method not implemented.');
		}
		addMessageToChannel(_channelId: string, _message: string): Promise<{ ok: boolean }> {
			throw new Error('Method not implemented.');
		}
	}

	return new SlackCommunicationGateAdapterStub();
};

describe('ConversationsSlackHandler', () => {
	let handler: ConversationsSlackHandler;
	const slackCommunicationGateAdapterStub = MakeSlackCommunicationGateAdapterStub();

	beforeAll(async () => {
		handler = new ConversationsSlackHandler(slackCommunicationGateAdapterStub);
	});

	it('should be defined', () => {
		expect(handler).toBeDefined();
	});

	it('should archive a channel', async () => {
		const channelName = 'any_channel_name';

		const spy = jest.spyOn(slackCommunicationGateAdapterStub, 'archive');

		const result = await handler.archiveChannel(channelName);

		expect(result).toBe(true);
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});

	it('should create a channel', async () => {
		const channelName = 'any_channel_name';

		const spy = jest.spyOn(slackCommunicationGateAdapterStub, 'addChannel');

		const result = await handler.createChannel(channelName);

		expect(result).toHaveProperty('id');
		expect(result.name).toBe(channelName);
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});

	it('should invite users to a channel by id', async () => {
		const channelId = 'any_channel_id';
		const users: UserDto[] = [
			{
				id: 'any_id',
				firstName: 'any_first_name',
				lastName: 'any_last_name',
				email: 'any_email',
				slackId: 'any_user_id',
				responsible: false
			}
		];

		const spy = jest.spyOn(slackCommunicationGateAdapterStub, 'addUsersToChannel');

		const result = await handler.inviteUsersToChannel(channelId, users);

		expect(result.ok).toBe(true);
		expect(result.channelId).toBe(channelId);
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});

	it('should get users from channel by id', async () => {
		const channelId = 'any_channel_id';

		const spy = jest.spyOn(slackCommunicationGateAdapterStub, 'getAllUsersByChannel');

		const result = await handler.getUsersFromChannelSlowly(channelId);

		expect(result).toBeInstanceOf(Array);
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});

	it('should throw error when adapter throws calling "archive"', async () => {
		const channelName = 'any_channel_name';

		const spy = jest
			.spyOn(slackCommunicationGateAdapterStub, 'archive')
			.mockImplementation(() => Promise.reject(new Error('some error')));

		await expect(handler.archiveChannel(channelName)).rejects.toThrowError();
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});

	it('should throw error when adapter throws calling "addChannel"', async () => {
		const channelName = 'any_channel_name';

		const spy = jest
			.spyOn(slackCommunicationGateAdapterStub, 'addChannel')
			.mockImplementation(() => Promise.reject(new Error('some error')));

		await expect(handler.createChannel(channelName)).rejects.toThrowError();
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});

	it('should throw error when adapter throws calling "addUsersToChannel"', async () => {
		const channelId = 'any_channel_id';
		const users: UserDto[] = [
			{
				id: 'any_id',
				firstName: 'any_first_name',
				lastName: 'any_last_name',
				email: 'any_email',
				slackId: 'any_user_id',
				responsible: false
			}
		];

		const spy = jest
			.spyOn(slackCommunicationGateAdapterStub, 'addUsersToChannel')
			.mockImplementation(() => Promise.reject(new Error('some error')));

		await expect(handler.inviteUsersToChannel(channelId, users)).rejects.toThrowError();
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});

	it('should throw error when adapter throws calling "getAllUsersByChannel"', async () => {
		const channelId = 'any_channel_id';

		const spy = jest
			.spyOn(slackCommunicationGateAdapterStub, 'getAllUsersByChannel')
			.mockImplementation(() => Promise.reject(new Error('some error')));

		await expect(handler.getUsersFromChannelSlowly(channelId)).rejects.toThrowError();
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});
});

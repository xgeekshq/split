import { UserDto } from 'modules/communication/dto/user.dto';
import { CommunicationGateAdapterInterface } from 'modules/communication/interfaces/communication-gate.adapter.interface';
import { ConversationsHandlerInterface } from 'modules/communication/interfaces/conversations.handler.interface';

export class ConversationsSlackHandler implements ConversationsHandlerInterface {
	constructor(private readonly communicationGateAdapter: CommunicationGateAdapterInterface) {}

	async createChannel(name: string): Promise<{ name: string; id: string }> {
		return this.communicationGateAdapter.addChannel(name);
	}

	async inviteUsersToChannel(
		channelId: string,
		users: UserDto[]
	): Promise<{ ok: boolean; channelId: string; fails?: string[] }> {
		const usersIds = users
			.filter((i) => typeof i.slackId === 'string')
			.map((i) => i.slackId as string);

		const { ok, fails } = await this.communicationGateAdapter.addUsersToChannel(
			channelId,
			usersIds
		);

		return { ok, channelId, fails };
	}

	async inviteUserToChannel(
		channelId: string,
		userId: string
	): Promise<{ ok: boolean; channelId: string; fails?: string[] }> {
		const { ok, fails } = await this.communicationGateAdapter.addUsersToChannel(channelId, [
			userId
		]);

		return { ok, channelId, fails };
	}

	async getUsersFromChannelSlowly(channelId: string): Promise<string[]> {
		return this.communicationGateAdapter.getAllUsersByChannel(channelId);
	}
}

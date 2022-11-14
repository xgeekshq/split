import { UserDto } from 'modules/communication/dto/user.dto';

export interface ConversationsHandlerInterface {
	createChannel(name: string): Promise<{ name: string; id: string }>;

	inviteUsersToChannel(
		channelId: string,
		users: UserDto[]
	): Promise<{ ok: boolean; channelId: string; fails?: string[] }>;
	inviteUserToChannel(
		channelId: string,
		userId: string
	): Promise<{ ok: boolean; channelId: string; fails?: string[] }>;

	getUsersFromChannelSlowly(channelId: string): Promise<string[]>;
}

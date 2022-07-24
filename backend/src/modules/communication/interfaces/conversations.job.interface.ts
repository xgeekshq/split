import { UserDto } from 'modules/communication/dto/user.dto';

export interface ConversationsJobInterface {
	createChannel(name: string): Promise<{ name: string; id: string }>;

	inviteUsersToChannel(
		channelId: string,
		users: UserDto[]
	): Promise<{ ok: boolean; channelId: string; fails?: string[] }>;

	getUsersFromChannelSlowly(channelId: string): Promise<string[]>;
}

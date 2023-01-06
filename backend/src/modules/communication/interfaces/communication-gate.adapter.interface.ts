export interface CommunicationGateAdapterInterface {
	// channels
	addChannel(name: string): Promise<{ id: string; name: string }>;

	// archive
	archive(channelId: string): Promise<{ ok: boolean; error?: string }>;

	// users
	addUsersToChannel(
		channelId: string,
		usersIds: string[]
	): Promise<{ ok: boolean; fails?: string[] }>;
	getAllUsersByChannel(channelId: string): Promise<string[]>;
	getEmailByUserId(userId: string): Promise<string>;
	getEmailByPlatformUserId(email: string): Promise<string>;

	// messages
	addMessageToChannel(channelId: string, message: string): Promise<{ ok: boolean }>;
}

export interface CommunicationGateInterface {
	// channels
	addChannel(name: string): Promise<{ id: string; name: string }>;

	// users
	addUsersToChannel(
		channelId: string,
		usersIds: string[]
	): Promise<{ ok: boolean; fails?: string[] }>;
	getAllUsersByChannel(channelId: string): Promise<string[]>;
	getEmailByUserId(userId: string): Promise<string>;
	getEmailByPlatformUserId(email: string): Promise<string>;
	kickUserFromChannel(userId: string, channelId: string): Promise<boolean>;

	// messages
	addMessageToChannel(
		channelId: string,
		message: string,
		timeStamp?: string
	): Promise<{ ok: boolean; ts?: string }>;
}

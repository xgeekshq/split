export interface CommunicationGateInterface {
  // channels
  addChannel(name: string): Promise<{ id: string; name: string }>;

  // users
  addUsersToChannel(
    channelId: string,
    usersIds: string[],
  ): Promise<{ ok: boolean; fails?: string[] }>;
  getAllUsersByChannel(channelId: string): Promise<string[]>;
  getEmailByUserId(userId: string): Promise<string>;

  // messages
  addMessageToChannel(channelId: string, message: string): Promise<boolean>;
}

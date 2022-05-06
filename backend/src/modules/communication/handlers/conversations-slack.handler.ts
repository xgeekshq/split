import { CommunicationGateInterface } from 'src/modules/communication/interfaces/communication-gate.interface';
import { ConversationsHandlerInterface } from 'src/modules/communication/interfaces/conversations.handler.interface';
import { UserDto } from 'src/modules/communication/dto/user.dto';

export class ConversationsSlackHandler
  implements ConversationsHandlerInterface
{
  constructor(
    private readonly communicationGateAdapter: CommunicationGateInterface,
  ) {}

  async createChannel(name: string): Promise<{ name: string; id: string }> {
    return this.communicationGateAdapter.addChannel(name);
  }

  async inviteUsersToChannel(
    channelId: string,
    users: UserDto[],
  ): Promise<{ ok: boolean; channelId: string; fails?: string[] }> {
    const usersIds = users
      .filter((i) => typeof i.slackId === 'string')
      .map((i) => i.slackId as string);

    const { ok, fails } = await this.communicationGateAdapter.addUsersToChannel(
      channelId,
      usersIds,
    );

    return { ok, channelId, fails };
  }

  async getUsersFromChannelSlowly(channelId: string): Promise<string[]> {
    return this.communicationGateAdapter.getAllUsersByChannel(channelId);
  }
}

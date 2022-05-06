import { CommunicationGateInterface } from 'src/modules/communication/interfaces/communication-gate.interface';
import { ChatHandlerInterface } from 'src/modules/communication/interfaces/chat.handler.interface';

export class ChatSlackHandler implements ChatHandlerInterface {
  constructor(
    private readonly communicationGateAdapter: CommunicationGateInterface,
  ) {}

  async postMessage(
    channelId: string,
    text: string,
  ): Promise<{ ok: boolean; channel: string }> {
    const ok = await this.communicationGateAdapter.addMessageToChannel(
      channelId,
      text,
    );

    return { ok, channel: channelId };
  }
}

import { ChatHandlerInterface } from 'modules/communication/interfaces/chat.handler.interface';
import { CommunicationGateAdapterInterface } from 'modules/communication/interfaces/communication-gate.adapter.interface';

export class ChatSlackHandler implements ChatHandlerInterface {
	constructor(private readonly communicationGateAdapter: CommunicationGateAdapterInterface) {}

	async postMessage(channelId: string, text: string): Promise<{ ok: boolean; channel: string }> {
		const { ok } = await this.communicationGateAdapter.addMessageToChannel(channelId, text);

		return { ok, channel: channelId };
	}
}

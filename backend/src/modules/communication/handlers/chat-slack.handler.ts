import { ChatHandlerInterface } from 'modules/communication/interfaces/chat.handler.interface';
import { CommunicationGateInterface } from 'modules/communication/interfaces/communication-gate.interface';

export class ChatSlackHandler implements ChatHandlerInterface {
	constructor(private readonly communicationGateAdapter: CommunicationGateInterface) {}

	async postMessage(
		channelId: string,
		text: string,
		timeStamp?: string
	): Promise<{ ok: boolean; channel: string; ts?: string }> {
		const { ok, ts } = await this.communicationGateAdapter.addMessageToChannel(
			channelId,
			text,
			timeStamp
		);
		return { ok, channel: channelId, ts };
	}
}

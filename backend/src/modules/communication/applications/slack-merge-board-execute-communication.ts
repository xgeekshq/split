import { MergeBoardCommunicationType } from '../dto/types';
import { ChatHandlerInterface } from '../interfaces/chat.handler.interface';
import { MergeBoardExecuteCommunicationInterface } from '../interfaces/merge-board-execute-communication.interface';

export class SlackMergeBoardExecuteCommunication
	implements MergeBoardExecuteCommunicationInterface
{
	constructor(
		private readonly chatHandler: ChatHandlerInterface,
		private readonly frontendUrl: string
	) {}

	async execute(data: MergeBoardCommunicationType): Promise<MergeBoardCommunicationType | null> {
		const { responsiblesChannelId, teamNumber, isLastSubBoard } = data;
		const message = `<!channel>, The board of team ${teamNumber} is ready. Link: ${this.frontendUrl}/${data.boardId}`;
		this.chatHandler.postMessage(responsiblesChannelId, message);
		if (isLastSubBoard) {
			const responsiblesMessage = `All boards are merged.`;
			this.chatHandler.postMessage(responsiblesChannelId, responsiblesMessage);
		}
		return data;
	}
}

import { MergeBoardCommunicationType } from '../dto/types';
import { ChatHandlerInterface } from '../interfaces/chat.handler.interface';
import { ConversationsHandlerInterface } from '../interfaces/conversations.handler.interface';
import { MergeBoardExecuteCommunicationInterface } from '../interfaces/merge-board-execute-communication.interface';
import { UsersHandlerInterface } from '../interfaces/users.handler.interface';

export class SlackMergeBoardExecuteCommunication
	implements MergeBoardExecuteCommunicationInterface
{
	constructor(
		private readonly chatHandler: ChatHandlerInterface,
		private readonly usersHandler: UsersHandlerInterface,
		private readonly conversationsHandler: ConversationsHandlerInterface
	) {}

	async execute(data: MergeBoardCommunicationType): Promise<MergeBoardCommunicationType | null> {
		const { responsiblesChannelId, teamNumber, isLastSubBoard, mainChannelId } = data;
		const message = `<!channel>, The board of team ${teamNumber} is ready`;
		this.chatHandler.postMessage(responsiblesChannelId, message);
		if (isLastSubBoard) {
			const responsiblesMessage = `All boards are merged`;
			this.chatHandler.postMessage(mainChannelId, responsiblesMessage);
		}
		return data;
	}
}

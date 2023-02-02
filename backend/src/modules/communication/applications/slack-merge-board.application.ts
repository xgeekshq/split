import { MergeBoardType } from '../dto/types';
import { ChatHandlerInterface } from '../interfaces/chat.handler.interface';
import { MergeBoardApplicationInterface } from '../interfaces/merge-board.application.interface';

export class SlackMergeBoardApplication implements MergeBoardApplicationInterface {
	constructor(
		private readonly chatHandler: ChatHandlerInterface,
		private readonly frontendUrl: string
	) {}

	async execute(data: MergeBoardType): Promise<MergeBoardType | null> {
		const { responsiblesChannelId, teamNumber, isLastSubBoard } = data;
		const message = `<!here>, The board of team ${teamNumber} is ready`;
		this.chatHandler.postMessage(responsiblesChannelId, message);

		if (isLastSubBoard) {
			const responsiblesMessage = `All sub-boards merged! Here's the complete board: ${this.frontendUrl}/boards/${data.mainBoardId}`;
			this.chatHandler.postMessage(responsiblesChannelId, responsiblesMessage);
		}

		return data;
	}
}

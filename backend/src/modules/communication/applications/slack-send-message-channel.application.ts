import { ChatHandlerInterface } from 'src/modules/communication/interfaces/chat.handler.interface';
import { SlackMessageDto } from '../dto/slack.message.dto';
import { SendMessageApplicationInterface } from '../interfaces/SendMessageApplication.interface';

export class SlackSendMessageApplication implements SendMessageApplicationInterface {
	constructor(private readonly chatHandler: ChatHandlerInterface) {}

	public async execute(data: SlackMessageDto): Promise<void> {
		await this.postMessageOnChannel(data);
	}

	private async postMessageOnChannel(data: SlackMessageDto): Promise<void> {
		this.chatHandler.postMessage(data.slackChannelId, data.message);
	}
}

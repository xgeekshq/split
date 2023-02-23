import { Inject, Injectable } from '@nestjs/common';
import { SlackMessageType } from '../dto/types';
import { SlackSendMessageProducer } from '../producers/slack-send-message-channel.producer';

@Injectable()
export class SlackSendMessagesService {
	constructor(
		@Inject(SlackSendMessageProducer)
		private readonly slackSendMessageProducer: SlackSendMessageProducer
	) {}

	//TODO: send message to the producer
	public async execute(data: SlackMessageType): Promise<void> {
		this.slackSendMessageProducer.send(data);
	}
}

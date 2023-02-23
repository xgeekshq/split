import { Inject, Injectable } from '@nestjs/common';
import { SlackMessageType } from '../dto/types';
import { SendMessageServiceInterface } from '../interfaces/send-message.service.interface';
import { SlackSendMessageProducer } from '../producers/slack-send-message-channel.producer';

@Injectable()
export class SlackSendMessageService implements SendMessageServiceInterface {
	constructor(
		@Inject(SlackSendMessageProducer)
		private readonly slackSendMessageProducer: SlackSendMessageProducer
	) {}

	//TODO: send message to the producer
	public async execute(data: SlackMessageType): Promise<void> {
		this.slackSendMessageProducer.send(data);
	}
}

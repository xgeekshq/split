import { Process, Processor } from '@nestjs/bull';
import { SlackSendMessageProducer } from '../producers/slack-send-message-channel.producer';
import { SlackMessageType } from 'src/modules/communication/dto/types';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { SlackCommunicationEventListeners } from './slack-communication-event-listeners';

@Processor(SlackSendMessageProducer.QUEUE_NAME)
export class SlackSendMessageConsumer extends SlackCommunicationEventListeners<
	SlackMessageType,
	SlackMessageType
> {
	constructor() {
		const logger = new Logger(SlackSendMessageProducer.name);
		super(logger);
	}

	@Process()
	override async communication(job: Job<SlackMessageType>) {
		const { slackChannelId } = job.data;

		this.logger.verbose(
			`execute communication for board with id: "${slackChannelId}" and Job id: "${job.id}" (pid ${process.pid})`
		);
	}
}

import { Process, Processor } from '@nestjs/bull';
import { SlackSendMessageProducer } from '../producers/slack-send-message-channel.producer';
import { SlackMessageType } from 'src/modules/communication/dto/types';
import { TYPES } from 'src/modules/communication/interfaces/types';
import { Job } from 'bull';
import { Inject, Logger } from '@nestjs/common';
import { SlackCommunicationEventListeners } from './slack-communication-event-listeners';
import { CommunicationApplicationInterface } from 'src/modules/communication/interfaces/communication.application.interface';

@Processor(SlackSendMessageProducer.QUEUE_NAME)
export class SlackSendMessageConsumer extends SlackCommunicationEventListeners<
	SlackMessageType,
	SlackMessageType
> {
	constructor(
		@Inject(TYPES.application.SlackCommunicationApplication)
		private readonly application: CommunicationApplicationInterface
	) {
		const logger = new Logger(SlackSendMessageProducer.name);
		super(logger);
	}

	@Process()
	override async communication(job: Job<SlackMessageType>) {
		const { slackChannelId } = job.data;

		this.logger.verbose(
			`execute communication for board with id: "${slackChannelId}" and Job id: "${job.id}" (pid ${process.pid})`
		);

		this.application.postMessageOnChannel(job.data);
	}
}

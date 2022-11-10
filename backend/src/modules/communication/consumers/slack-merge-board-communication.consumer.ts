import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { MergeBoardCommunicationType } from 'modules/communication/dto/types';

import { SlackMergeBoardExecuteCommunication } from '../applications/slack-merge-board-execute-communication';
import { SlackMergeBoardCommunicationProducer } from '../producers/slack-merge-board-communication.producer';
import { SlackCommunicationEventListeners } from './slack-communication-event-listeners';

@Processor(SlackMergeBoardCommunicationProducer.QUEUE_NAME)
export class SlackMergeBoardCommunicationConsumer extends SlackCommunicationEventListeners<
	MergeBoardCommunicationType,
	MergeBoardCommunicationType
> {
	constructor(private readonly application: SlackMergeBoardExecuteCommunication) {
		const logger = new Logger(SlackMergeBoardCommunicationConsumer.name);
		super(logger);
	}

	@Process()
	override async communication(job: Job<MergeBoardCommunicationType>) {
		const data = job.data;

		this.logger.verbose(
			`Execute the sub board ${job.data.teamNumber} merged message and Job id: "${job.id}" (pid ${process.pid})`
		);

		const result = await this.application.execute(data);

		return result;
	}
}

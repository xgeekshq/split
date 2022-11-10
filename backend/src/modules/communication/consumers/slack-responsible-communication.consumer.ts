import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { ChangeResponsibleType } from 'modules/communication/dto/types';

import { SlackResponsibleExecuteCommunication } from '../applications/slack-execute-responsible-communication.application';
import { SlackResponsibleCommunicationProducer } from '../producers/slack-responsible-communication.producer';
import { SlackCommunicationEventListeners } from './slack-communication-event-listeners';

@Processor(SlackResponsibleCommunicationProducer.QUEUE_NAME)
export class SlackResponsibleCommunicationConsumer extends SlackCommunicationEventListeners<
	ChangeResponsibleType,
	ChangeResponsibleType
> {
	constructor(private readonly application: SlackResponsibleExecuteCommunication) {
		const logger = new Logger(SlackResponsibleCommunicationProducer.name);
		super(logger);
	}

	@Process()
	override async communication(job: Job<ChangeResponsibleType>) {
		const data = job.data;

		this.logger.verbose(
			`Execute change responsible of team "${data.teamNumber}" in ${
				data.threadTimeStamp ? 'main' : 'sub board'
			} channel added to queue with Job id: "${job.id}"`
		);

		const result = await this.application.execute(data);

		return result;
	}
}

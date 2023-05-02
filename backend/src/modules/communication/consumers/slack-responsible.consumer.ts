import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ChangeResponsibleType } from 'src/modules/communication/dto/types';
import { ResponsibleApplicationInterface } from 'src/modules/communication/interfaces/responsible.application.interface';
import { SLACK_RESPONSIBLE_APPLICATION } from 'src/modules/communication/constants';
import { SlackResponsibleProducer } from '../producers/slack-responsible.producer';
import { SlackCommunicationEventListeners } from './slack-communication-event-listeners';

@Processor(SlackResponsibleProducer.QUEUE_NAME)
export class SlackResponsibleConsumer extends SlackCommunicationEventListeners<
	ChangeResponsibleType,
	ChangeResponsibleType
> {
	constructor(
		@Inject(SLACK_RESPONSIBLE_APPLICATION)
		private readonly application: ResponsibleApplicationInterface
	) {
		const logger = new Logger(SlackResponsibleProducer.name);
		super(logger);
	}

	@Process()
	override async communication(job: Job<ChangeResponsibleType>) {
		const data = job.data;

		this.logger.verbose(
			`Execute change responsible of team "${data.teamNumber}" channel added to queue with Job id: "${job.id}"`
		);

		const result = await this.application.execute(data);

		return result;
	}
}

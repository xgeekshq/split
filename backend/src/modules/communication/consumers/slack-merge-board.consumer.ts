import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';

import { MergeBoardType } from 'modules/communication/dto/types';
import { MergeBoardApplicationInterface } from 'modules/communication/interfaces/merge-board.application.interface';
import { TYPES } from 'modules/communication/interfaces/types';

import { SlackMergeBoardProducer } from '../producers/slack-merge-board.producer';
import { SlackCommunicationEventListeners } from './slack-communication-event-listeners';

@Processor(SlackMergeBoardProducer.QUEUE_NAME)
export class SlackMergeBoardConsumer extends SlackCommunicationEventListeners<
	MergeBoardType,
	MergeBoardType
> {
	constructor(
		@Inject(TYPES.application.SlackMergeBoardApplication)
		private readonly application: MergeBoardApplicationInterface
	) {
		const logger = new Logger(SlackMergeBoardConsumer.name);
		super(logger);
	}

	@Process()
	override async communication(job: Job<MergeBoardType>) {
		const data = job.data;

		this.logger.verbose(
			`Execute the sub board ${job.data.teamNumber} merged message and Job id: "${job.id}" (pid ${process.pid})`
		);

		const result = await this.application.execute(data);

		return result;
	}
}

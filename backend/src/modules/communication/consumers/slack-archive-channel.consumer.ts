import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
	ArchiveChannelData,
	ArchiveChannelDataOptions,
	ArchiveChannelResult,
	BoardType
} from 'src/modules/communication/dto/types';
import { ArchiveChannelApplicationInterface } from 'src/modules/communication/interfaces/archive-channel.application.interface';
import { TYPES } from 'src/modules/communication/interfaces/types';
import { SlackArchiveChannelProducer } from 'src/modules/communication/producers/slack-archive-channel.producer';
import { SlackCommunicationEventListeners } from './slack-communication-event-listeners';

@Processor(SlackArchiveChannelProducer.QUEUE_NAME)
export class SlackArchiveChannelConsumer extends SlackCommunicationEventListeners<
	ArchiveChannelData,
	ArchiveChannelResult[]
> {
	constructor(
		@Inject(TYPES.application.SlackArchiveChannelApplication)
		private readonly application: ArchiveChannelApplicationInterface
	) {
		const logger = new Logger(SlackArchiveChannelConsumer.name);
		super(logger);
	}

	@Process()
	override async communication(job: Job<ArchiveChannelData>) {
		const data = job.data;

		if (data.type === ArchiveChannelDataOptions.CHANNEL_ID) {
			this.logger.verbose(`Archive channel with id: "${data.data}" and Job id: "${job.id}"`);
		}

		if (data.type === ArchiveChannelDataOptions.BOARD) {
			this.logger.verbose(
				`Archive related channel(s) to board with id: "${
					(data.data as BoardType).id
				}" and Job id: "${job.id}"`
			);
		}

		const result = await this.application.execute(data);

		return result;
	}
}

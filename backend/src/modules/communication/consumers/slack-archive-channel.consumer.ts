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
import { SLACK_ARCHIVE_CHANNEL_APPLICATION } from 'src/modules/communication/constants';
import { SlackArchiveChannelProducer } from 'src/modules/communication/producers/slack-archive-channel.producer';
import { SlackCommunicationEventListeners } from './slack-communication-event-listeners';

@Processor(SlackArchiveChannelProducer.QUEUE_NAME)
export class SlackArchiveChannelConsumer extends SlackCommunicationEventListeners<
	ArchiveChannelData,
	ArchiveChannelResult[]
> {
	constructor(
		@Inject(SLACK_ARCHIVE_CHANNEL_APPLICATION)
		private readonly application: ArchiveChannelApplicationInterface
	) {
		const logger = new Logger(SlackArchiveChannelConsumer.name);
		super(logger);
	}

	@Process()
	override async communication(job: Job<ArchiveChannelData>) {
		const data = job.data;

		if (data.type === ArchiveChannelDataOptions.CHANNEL_ID) {
			this.logger.verbose(
				`Archive channel with id: "${data.data}" and Job id: "${job.id.toString()}"`
			);
		}

		if (data.type === ArchiveChannelDataOptions.BOARD) {
			this.logger.verbose(
				`Archive related channel(s) to board with id: "${
					(data.data as BoardType).id
				}" and Job id: "${job.id.toString()}"`
			);
		}

		return this.application.execute(data);
	}
}

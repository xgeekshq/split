import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import {
	ArchiveChannelData,
	ArchiveChannelDataOptions,
	BoardType,
	PartialBoardType
} from 'src/modules/communication/dto/types';

@Injectable()
export class SlackArchiveChannelProducer {
	private logger = new Logger(SlackArchiveChannelProducer.name);

	public static readonly QUEUE_NAME = 'SlackArchiveChannelProducer';

	public static readonly ATTEMPTS = 3;

	public static readonly BACKOFF = 3;

	public static readonly DELAY = 0;

	public static readonly REMOVE_ON_COMPLETE = true;

	public static readonly REMOVE_ON_FAIL = true;

	public static readonly PRIORITY = 1;

	constructor(
		@InjectQueue(SlackArchiveChannelProducer.QUEUE_NAME)
		private readonly queue: Queue
	) {}

	// Job Options https://docs.nestjs.com/techniques/queues#job-options
	async add(data: ArchiveChannelData): Promise<Job<ArchiveChannelData>> {
		const job = await this.queue.add(data);

		if (data.type === ArchiveChannelDataOptions.CHANNEL_ID) {
			this.logger.verbose(
				`Add channel with id: "${
					(data.data as PartialBoardType).id
				}" to be archived to queue with Job id: "${job.id}"`
			);
		}

		if (data.type === ArchiveChannelDataOptions.BOARD) {
			this.logger.verbose(
				`Add board with id: "${
					(data.data as BoardType).id
				}" to archived related channels to queue with Job id: "${job.id}"`
			);
		}

		return job;
	}
}

import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';

import { MergeBoardCommunicationType } from 'modules/communication/dto/types';

@Injectable()
export class SlackMergeBoardCommunicationProducer {
	private logger = new Logger(SlackMergeBoardCommunicationProducer.name);

	public static readonly QUEUE_NAME = 'SlackMergeBoardCommunicationProducer';

	public static readonly ATTEMPTS = 3;

	public static readonly BACKOFF = 3;

	public static readonly DELAY = 0;

	public static readonly REMOVE_ON_COMPLETE = true;

	public static readonly REMOVE_ON_FAIL = true;

	public static readonly PRIORITY = 2;

	constructor(
		@InjectQueue(SlackMergeBoardCommunicationProducer.QUEUE_NAME)
		private readonly queue: Queue
	) {}

	async add(data: MergeBoardCommunicationType): Promise<Job<MergeBoardCommunicationType>> {
		const job = await this.queue.add(data);

		this.logger.verbose(
			`The sub board ${job.data.teamNumber} was merged and the message was added to queue with Job id: "${job.id}"`
		);

		return job;
	}
}

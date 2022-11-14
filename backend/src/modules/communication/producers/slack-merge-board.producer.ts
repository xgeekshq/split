import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';

import { MergeBoardType } from 'modules/communication/dto/types';

@Injectable()
export class SlackMergeBoardProducer {
	private logger = new Logger(SlackMergeBoardProducer.name);

	public static readonly QUEUE_NAME = 'SlackMergeBoardProducer';

	public static readonly ATTEMPTS = 3;

	public static readonly BACKOFF = 3;

	public static readonly DELAY = 0;

	public static readonly REMOVE_ON_COMPLETE = true;

	public static readonly REMOVE_ON_FAIL = true;

	public static readonly PRIORITY = 2;

	constructor(
		@InjectQueue(SlackMergeBoardProducer.QUEUE_NAME)
		private readonly queue: Queue
	) {}

	async add(data: MergeBoardType): Promise<Job<MergeBoardType>> {
		const job = await this.queue.add(data);

		this.logger.verbose(
			`The sub board ${job.data.teamNumber} was merged and the message was added to queue with Job id: "${job.id}"`
		);

		return job;
	}
}

import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';

import { JobType } from 'modules/communication/dto/types';

@Injectable()
export class CommunicationProducerService {
	public static readonly QUEUE_NAME = 'slack-queue';

	constructor(
		@InjectQueue(CommunicationProducerService.QUEUE_NAME)
		private readonly queue: Queue
	) {}

	// Job Options https://docs.nestjs.com/techniques/queues#job-options
	async add(data: JobType): Promise<Job<JobType>> {
		const result = await this.queue.add(data, {
			lifo: true
		});

		return result;
	}
}

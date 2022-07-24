import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';

import { JobType } from 'modules/communication/dto/types';

@Injectable()
export class CommunicationProducerService {
	private logger = new Logger(CommunicationProducerService.name);

	public static readonly QUEUE_NAME = 'slack-queue';

	constructor(
		@InjectQueue(CommunicationProducerService.QUEUE_NAME)
		private readonly queue: Queue
	) {}

	// Job Options https://docs.nestjs.com/techniques/queues#job-options
	async add(data: JobType): Promise<Job<JobType>> {
		const job = await this.queue.add(data, {
			lifo: true
		});

		this.logger.verbose(
			`Add board with id: "${data.board.id}" to queue with Job id: "${job.id}" (pid ${process.pid})`
		);

		return job;
	}
}

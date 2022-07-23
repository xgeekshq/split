import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class CommunicationProducerService {
	public static readonly QUEUE_NAME = 'slack-queue';

	constructor(
		@InjectQueue(CommunicationProducerService.QUEUE_NAME)
		private readonly queue: Queue
	) {}

	// Job Options https://docs.nestjs.com/techniques/queues#job-options
	async add(data: any) {
		await this.queue.add(data, {
			lifo: true
		});
	}
}

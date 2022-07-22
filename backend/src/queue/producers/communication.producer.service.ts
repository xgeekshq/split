import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class CommunicationProducerService {
	public static readonly QUEUE_NAME = 'slack-queue';

	public static readonly COMMUNICATION_TO_QUEUE_JOB = 'communication-to-queue-job';

	constructor(@InjectQueue(CommunicationProducerService.QUEUE_NAME) private queue: Queue) {}

	// Job Options https://docs.nestjs.com/techniques/queues#job-options
	async sendToQueue(data: any) {
		await this.queue.add(CommunicationProducerService.COMMUNICATION_TO_QUEUE_JOB, data);
	}
}

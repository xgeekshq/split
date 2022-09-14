import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { createWriteStream } from 'fs';

import { JobType } from 'modules/communication/dto/types';

@Injectable()
export class CommunicationProducerService {
	private logger = new Logger(CommunicationProducerService.name);

	public static readonly QUEUE_NAME = 'slack-queue';

	constructor(
		@InjectQueue(CommunicationProducerService.QUEUE_NAME)
		private readonly queue: Queue
	) {
		// https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#events
		this.queue.on('completed', (job: Job<JobType>, result: any) => {
			this.logger.verbose(`Completed Job id: "${job.id}"`);

			console.log(result);

			this.saveLog(result);

			job.remove();
		});
		this.queue.on('error', (error: Error) => {
			this.logger.error(`Error on queue: "${JSON.stringify(error)}"`);
		});
		this.queue.on('failed', (job: Job<JobType>, error) => {
			this.logger.error(`Job id: "${job.id}" fails with error: "${JSON.stringify(error)}"`);
		});
	}

	// Job Options https://docs.nestjs.com/techniques/queues#job-options
	async add(data: JobType): Promise<Job<JobType>> {
		const job = await this.queue.add(data);

		this.logger.verbose(
			`Add board with id: "${data.board.id}" to queue with Job id: "${job.id}" (pid ${process.pid})`
		);

		return job;
	}

	saveLog(data: any) {
		try {
			const stream = createWriteStream('slackLog.txt', { flags: 'a' });
			stream.write(`${JSON.stringify(data)}\n`);
			stream.end();
		} catch (error) {
			this.logger.error(error);
		}
	}
}

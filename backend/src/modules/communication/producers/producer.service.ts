import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';

import { TeamDto } from 'modules/communication/dto/team.dto';
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
		this.queue.on('completed', (job: Job<JobType>, data: TeamDto[]) => {
			this.logger.verbose(`Completed Job id: "${job.id}"`);
			console.log(data);
			job.remove();
		});
		this.queue.on('error', (error: Error) => {
			this.logger.error(`Error on queue: "${error}"`);
		});
		this.queue.on('failed', (job: Job<JobType>, error) => {
			this.logger.error(`Job id: "${job.id}" fails with error: "${error}"`);
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
}

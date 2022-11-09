import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';

import { BoardType, JobResponsibleType } from 'modules/communication/dto/types';

@Injectable()
export class SlackCommunicationProducer {
	private logger = new Logger(SlackCommunicationProducer.name);

	public static readonly QUEUE_NAME = 'SlackCommunicationProducer';

	public static readonly ATTEMPTS = 3;

	public static readonly BACKOFF = 3;

	public static readonly DELAY = 0;

	public static readonly REMOVE_ON_COMPLETE = true;

	public static readonly REMOVE_ON_FAIL = false;

	public static readonly PRIORITY = 1;

	constructor(
		@InjectQueue(SlackCommunicationProducer.QUEUE_NAME)
		private readonly queue: Queue
	) {}

	// Job Options https://docs.nestjs.com/techniques/queues#job-options
	async add(data: BoardType): Promise<Job<BoardType>> {
		const job = await this.queue.add(data);

		this.logger.verbose(`Add board with id: "${data.id}" to queue with Job id: "${job.id}"`);

		return job;
	}

	async addResponsibleJob(data: JobResponsibleType): Promise<Job<BoardType>> {
		const job = await this.queue.add(data);

		this.logger.verbose(
			`Change responsible of team "${data.changeResponsibleDto.teamNumber}" in ${
				data.changeResponsibleDto.threadTimeStamp ? 'main' : 'sub board'
			} channel added to queue with Job id: "${job.id}"`
		);

		return job;
	}
}

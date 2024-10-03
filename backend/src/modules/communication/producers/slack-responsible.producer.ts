import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { ChangeResponsibleType } from 'src/modules/communication/dto/types';

@Injectable()
export class SlackResponsibleProducer {
	private logger = new Logger(SlackResponsibleProducer.name);

	public static readonly QUEUE_NAME = 'SlackResponsibleProducer';

	public static readonly ATTEMPTS = 3;

	public static readonly BACKOFF = 3;

	public static readonly DELAY = 0;

	public static readonly REMOVE_ON_COMPLETE = true;

	public static readonly REMOVE_ON_FAIL = true;

	public static readonly PRIORITY = 2;

	constructor(
		@InjectQueue(SlackResponsibleProducer.QUEUE_NAME)
		private readonly queue: Queue
	) {}

	async add(data: ChangeResponsibleType): Promise<Job<ChangeResponsibleType>> {
		const job = await this.queue.add(data);

		this.logger.verbose(
			`Change responsible of team "${data.teamNumber}" in channel added to queue with Job id: "${job.id.toString().toString()}"`
		);

		return job;
	}
}

import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { AddUserMainChannelType } from 'src/modules/communication/dto/types';

@Injectable()
export class SlackAddUserToChannelProducer {
	private logger = new Logger(SlackAddUserToChannelProducer.name);

	public static readonly QUEUE_NAME = 'SlackAddUserToChannelProducer';

	public static readonly ATTEMPTS = 3;

	public static readonly BACKOFF = 3;

	public static readonly DELAY = 0;

	public static readonly REMOVE_ON_COMPLETE = true;

	public static readonly REMOVE_ON_FAIL = true;

	public static readonly PRIORITY = 1;

	constructor(
		@InjectQueue(SlackAddUserToChannelProducer.QUEUE_NAME)
		private readonly queue: Queue
	) {}

	// Job Options https://docs.nestjs.com/techniques/queues#job-options
	async add(data: AddUserMainChannelType): Promise<Job<AddUserMainChannelType>> {
		const job = await this.queue.add(data);

		this.logger.verbose(
			`Add user into mainchannel with email "${data.email}" to queue with Job id: "${job.id}"`
		);

		return job;
	}
}

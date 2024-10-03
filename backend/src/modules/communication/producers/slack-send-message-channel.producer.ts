import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { SlackMessageType } from 'src/modules/communication/dto/types';

@Injectable()
export class SlackSendMessageProducer {
	private logger = new Logger(SlackSendMessageProducer.name);

	public static readonly QUEUE_NAME = SlackSendMessageProducer.name;

	public static readonly ATTEMPTS = 3;

	public static readonly BACKOFF = 3;

	public static readonly DELAY = 0;

	public static readonly REMOVE_ON_COMPLETE = true;

	public static readonly REMOVE_ON_FAIL = true;

	public static readonly PRIORITY = 1;

	constructor(
		@InjectQueue(SlackSendMessageProducer.QUEUE_NAME)
		private readonly queue: Queue
	) {}

	// Job Options https://docs.nestjs.com/techniques/queues#job-options
	async send(data: SlackMessageType): Promise<Job<SlackMessageType>> {
		const job = await this.queue.add(data);

		this.logger.verbose(
			`Add SlackMessage with SlackChannelid: "${data.slackChannelId}" to queue with Job id: "${job.id.toString()}"`
		);

		return job;
	}
}

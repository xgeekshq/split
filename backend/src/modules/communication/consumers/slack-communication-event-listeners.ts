import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { createWriteStream } from 'fs';

export class SlackCommunicationEventListeners<T, R> {
	constructor(public logger: Logger) {}

	@Process()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	communication(job: Job<T>) {}

	// https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#events
	@OnQueueCompleted()
	async onCompleted(job: Job<T>, result: R[]) {
		this.logger.verbose(`Completed Job id: "${job.id}"`);
		this.saveLog(result);
	}

	@OnQueueFailed()
	async onFailed(job: Job<T>, error) {
		this.logger.error(`Job id: "${job.id}" fails with error: "${JSON.stringify(error)}"`);
	}

	@OnQueueError()
	onError(error: Error) {
		this.logger.error(`Error on queue: "${JSON.stringify(error)}"`);
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

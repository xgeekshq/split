import {
	OnQueueActive,
	OnQueueCompleted,
	OnQueueError,
	OnQueueFailed,
	Process,
	Processor
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { CommunicationProducerService } from '../producers/communication.producer.service';

@Processor(CommunicationProducerService.QUEUE_NAME)
export class CommunicationConsumer {
	private logger = new Logger(CommunicationConsumer.name);

	// constructor() {}

	@Process(CommunicationProducerService.COMMUNICATION_TO_QUEUE_JOB)
	async consumeCommunicationFromQueue(job: Job<any>) {
		try {
			this.logger.verbose('consumeCommunicationFromQueue');
			return;
		} catch (error) {
			this.logger.error(error.message);

			// return error;
		}
	}

	// others built-in https://docs.nestjs.com/techniques/queues#event-listeners
	@OnQueueActive()
	onActive(job: Job<any>) {
		console.log(
			`Processing job ${job.id} of type ${job.name} with main board name ${job.data.title}...`
		);
	}

	@OnQueueCompleted()
	onCompleted(job: Job<any>, result: any) {
		console.log(
			`Completed job ${job.id} of type ${job.name} with result ${JSON.stringify(result)}.`
		);
	}

	@OnQueueError()
	onError(error: Error) {
		this.logger.error(error.message);
	}

	@OnQueueFailed()
	onFailed(job: Job<any>, error: Error) {
		this.logger.error(`${job.name} fail: ${error.message}`);
	}
}

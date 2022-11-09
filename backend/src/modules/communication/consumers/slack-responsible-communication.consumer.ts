import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { createWriteStream } from 'fs';

import { TeamDto } from 'modules/communication/dto/team.dto';
import { ChangeResponsibleType } from 'modules/communication/dto/types';

import { SlackResponsibleExecuteCommunication } from '../applications/slack-execute-responsible-communication.application';
import { SlackResponsibleCommunicationProducer } from '../producers/slack-responsible-communication.producer';

@Processor(SlackResponsibleCommunicationProducer.QUEUE_NAME)
export class SlackResponsibleCommunicationConsumer {
	private readonly logger = new Logger(SlackResponsibleCommunicationProducer.name);

	constructor(private readonly application: SlackResponsibleExecuteCommunication) {}

	@Process()
	async communication(job: Job<ChangeResponsibleType>) {
		const data = job.data;

		this.logger.verbose(
			`Execute change responsible of team "${data.teamNumber}" in ${
				data.threadTimeStamp ? 'main' : 'sub board'
			} channel added to queue with Job id: "${job.id}"`
		);

		const result = await this.application.execute(data);

		return result;
	}

	// https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#events
	@OnQueueCompleted()
	async onCompleted(job: Job<ChangeResponsibleType>, result: TeamDto[]) {
		this.logger.verbose(`Completed Job id: "${job.id}"`);
		this.saveLog(result);
	}

	@OnQueueFailed()
	async onFailed(job: Job<ChangeResponsibleType>, error) {
		this.logger.error(`Job id: "${job.id}" fails with error: "${JSON.stringify(error)}"`);
	}

	@OnQueueError()
	onError(error: Error) {
		this.logger.error(`Error on queue: "${JSON.stringify(error)}"`);
	}

	private saveLog(data: any) {
		try {
			const stream = createWriteStream('slackLog.txt', { flags: 'a' });
			stream.write(`${JSON.stringify(data)}\n`);
			stream.end();
		} catch (error) {
			this.logger.error(error);
		}
	}
}

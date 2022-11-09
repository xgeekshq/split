import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { createWriteStream } from 'fs';

import { BoardType, MergeBoardCommunicationType } from 'modules/communication/dto/types';

import { SlackMergeBoardExecuteCommunication } from '../applications/slack-merge-board-execute-communication';
import { SlackMergeBoardCommunicationProducer } from '../producers/slack-merge-board-communication.producer';

@Processor(SlackMergeBoardCommunicationProducer.QUEUE_NAME)
export class SlackMergeBoardCommunicationConsumer {
	private readonly logger = new Logger(SlackMergeBoardCommunicationConsumer.name);

	constructor(private readonly application: SlackMergeBoardExecuteCommunication) {}

	@Process()
	async communication(job: Job<MergeBoardCommunicationType>) {
		const data = job.data;

		this.logger.verbose(
			`Execute the sub board ${job.data.teamNumber} merged message and Job id: "${job.id}" (pid ${process.pid})`
		);

		const result = await this.application.execute(data);

		return result;
	}

	// EXTRAIR ESTES METODOS PARA CLASSE E EXTENDER
	// https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#events
	@OnQueueCompleted()
	async onCompleted(job: Job<MergeBoardCommunicationType>, result: MergeBoardCommunicationType[]) {
		this.logger.verbose(`Completed Job id: "${job.id}"`);
		this.saveLog(result);
	}

	@OnQueueFailed()
	async onFailed(job: Job<BoardType>, error) {
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

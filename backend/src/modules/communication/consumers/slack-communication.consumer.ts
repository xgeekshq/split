import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { createWriteStream } from 'fs';

import { UpdateBoardServiceInterface } from 'modules/boards/interfaces/services/update.board.service.interface';
import { TYPES } from 'modules/boards/interfaces/types';
import { SlackExecuteCommunication } from 'modules/communication/applications/slack-execute-communication.application';
import { TeamDto } from 'modules/communication/dto/team.dto';
import { BoardType } from 'modules/communication/dto/types';
import { SlackCommunicationProducer } from 'modules/communication/producers/slack-communication.producer';

@Processor(SlackCommunicationProducer.QUEUE_NAME)
export class SlackCommunicationConsumer {
	private readonly logger = new Logger(SlackCommunicationConsumer.name);

	constructor(
		private readonly application: SlackExecuteCommunication,
		@Inject(TYPES.services.UpdateBoardService)
		private updateBoardService: UpdateBoardServiceInterface
	) {}

	@Process()
	async communication(job: Job<BoardType>) {
		const board = job.data;

		this.logger.verbose(
			`execute communication for board with id: "${board.id}" and Job id: "${job.id}" (pid ${process.pid})`
		);

		const result = await this.application.execute(board);

		return result;
	}

	// https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#events
	@OnQueueCompleted()
	async onCompleted(job: Job<BoardType>, result: TeamDto[]) {
		this.logger.verbose(`Completed Job id: "${job.id}"`);
		this.updateBoardService.updateChannelId(result);
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

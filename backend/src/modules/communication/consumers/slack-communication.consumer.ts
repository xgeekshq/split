import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';

import { UpdateBoardServiceInterface } from 'modules/boards/interfaces/services/update.board.service.interface';
import { TYPES } from 'modules/boards/interfaces/types';
import { SlackExecuteCommunication } from 'modules/communication/applications/slack-execute-communication.application';
import { TeamDto } from 'modules/communication/dto/team.dto';
import { BoardType } from 'modules/communication/dto/types';
import { SlackCommunicationProducer } from 'modules/communication/producers/slack-communication.producer';

import { SlackCommunicationEventListeners } from './slack-communication-event-listeners';

@Processor(SlackCommunicationProducer.QUEUE_NAME)
export class SlackCommunicationConsumer extends SlackCommunicationEventListeners<
	BoardType,
	TeamDto
> {
	constructor(
		private readonly application: SlackExecuteCommunication,
		@Inject(TYPES.services.UpdateBoardService)
		private updateBoardService: UpdateBoardServiceInterface
	) {
		const logger = new Logger(SlackCommunicationConsumer.name);
		super(logger);
	}

	@Process()
	override async communication(job: Job<BoardType>) {
		const board = job.data;

		this.logger.verbose(
			`execute communication for board with id: "${board.id}" and Job id: "${job.id}" (pid ${process.pid})`
		);

		const result = await this.application.execute(board);

		return result;
	}

	// https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#events
	@OnQueueCompleted()
	override async onCompleted(job: Job<BoardType>, result: TeamDto[]) {
		this.logger.verbose(`Completed Job id: "${job.id}"`);
		this.updateBoardService.updateChannelId(result);
		this.saveLog(result);
	}
}

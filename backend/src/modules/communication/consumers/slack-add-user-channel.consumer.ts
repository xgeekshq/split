import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { AddUserMainChannelType } from 'src/modules/communication/dto/types';
import { SLACK_ADD_USER_INTO_CHANNEL_APPLICATION } from 'src/modules/communication/constants';
import { AddUserIntoChannelApplicationInterface } from '../interfaces/communication.application.interface copy';
import { SlackAddUserToChannelProducer } from '../producers/slack-add-user-channel.producer';
import { SlackCommunicationEventListeners } from './slack-communication-event-listeners';

@Processor(SlackAddUserToChannelProducer.QUEUE_NAME)
export class SlackAddUserToChannelConsumer extends SlackCommunicationEventListeners<
	AddUserMainChannelType,
	boolean
> {
	constructor(
		@Inject(SLACK_ADD_USER_INTO_CHANNEL_APPLICATION)
		private readonly application: AddUserIntoChannelApplicationInterface
	) {
		const logger = new Logger(SlackAddUserToChannelConsumer.name);
		super(logger);
	}

	@Process()
	override async communication(job: Job<AddUserMainChannelType>) {
		const { email } = job.data;

		this.logger.verbose(
			`execute communication for adding user with email: "${email}" and Job id: "${job.id}" (pid ${process.pid})`
		);

		const result = await this.application.execute(email);

		return result;
	}

	// https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#events
	@OnQueueCompleted()
	override async onCompleted(job: Job<AddUserMainChannelType>, result: boolean[]) {
		this.logger.verbose(
			`Completed Job id: "${job.id}". User with email: ${job.data.email} was ${
				!result[0] ? 'not' : ''
			} added to the main channel`
		);
	}
}

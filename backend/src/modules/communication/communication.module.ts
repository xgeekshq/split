import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';

import { configuration } from 'infrastructure/config/configuration';
import BoardsModule from 'modules/boards/boards.module';
import {
	ChatHandler,
	CommunicationApplication,
	CommunicationGateAdapter,
	CommunicationService,
	ConversationsHandler,
	MergeBoardApplication,
	ResponsibleApplication,
	UsersHandler
} from 'modules/communication/communication.providers';
import { SlackCommunicationConsumer } from 'modules/communication/consumers/slack-communication.consumer';
import { SlackCommunicationProducer } from 'modules/communication/producers/slack-communication.producer';

import { SlackMergeBoardConsumer } from './consumers/slack-merge-board.consumer';
import { SlackResponsibleConsumer } from './consumers/slack-responsible.consumer';
import { SlackMergeBoardProducer } from './producers/slack-merge-board.producer';
import { SlackResponsibleProducer } from './producers/slack-responsible.producer';

@Module({
	imports: [
		forwardRef(() => BoardsModule),
		...(configuration().slack.enable
			? [
					BullModule.registerQueue({
						name: SlackCommunicationProducer.QUEUE_NAME,
						defaultJobOptions: {
							attempts: SlackCommunicationProducer.ATTEMPTS,
							backoff: SlackCommunicationProducer.BACKOFF,
							delay: SlackCommunicationProducer.DELAY,
							removeOnFail: SlackCommunicationProducer.REMOVE_ON_FAIL,
							removeOnComplete: SlackCommunicationProducer.REMOVE_ON_COMPLETE,
							priority: SlackCommunicationProducer.PRIORITY
						}
					}),
					BullModule.registerQueue({
						name: SlackResponsibleProducer.QUEUE_NAME,
						defaultJobOptions: {
							attempts: SlackResponsibleProducer.ATTEMPTS,
							backoff: SlackResponsibleProducer.BACKOFF,
							delay: SlackResponsibleProducer.DELAY,
							removeOnFail: SlackResponsibleProducer.REMOVE_ON_FAIL,
							removeOnComplete: SlackResponsibleProducer.REMOVE_ON_COMPLETE,
							priority: SlackResponsibleProducer.PRIORITY
						}
					}),
					BullModule.registerQueue({
						name: SlackMergeBoardProducer.QUEUE_NAME,
						defaultJobOptions: {
							attempts: SlackMergeBoardProducer.ATTEMPTS,
							backoff: SlackMergeBoardProducer.BACKOFF,
							delay: SlackMergeBoardProducer.DELAY,
							removeOnFail: SlackMergeBoardProducer.REMOVE_ON_FAIL,
							removeOnComplete: SlackMergeBoardProducer.REMOVE_ON_COMPLETE,
							priority: SlackMergeBoardProducer.PRIORITY
						}
					})
			  ]
			: [])
	],
	providers: [
		CommunicationService,
		...(configuration().slack.enable
			? [
					CommunicationGateAdapter,
					ChatHandler,
					ConversationsHandler,
					UsersHandler,
					CommunicationApplication,
					ResponsibleApplication,
					MergeBoardApplication,
					SlackCommunicationProducer,
					SlackCommunicationConsumer,
					SlackResponsibleProducer,
					SlackResponsibleConsumer,
					SlackMergeBoardProducer,
					SlackMergeBoardConsumer
			  ]
			: [])
	],
	exports: [CommunicationService]
})
export class CommunicationModule {}

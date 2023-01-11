import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { configuration } from 'src/infrastructure/config/configuration';
import BoardsModule from 'src/modules/boards/boards.module';
import {
	ArchiveChannelApplication,
	ArchiveChannelService,
	ChatHandler,
	CommunicationApplication,
	CommunicationGateAdapter,
	CommunicationService,
	ConversationsHandler,
	MergeBoardApplication,
	ResponsibleApplication,
	UsersHandler
} from 'src/modules/communication/communication.providers';
import { SlackArchiveChannelConsumer } from 'src/modules/communication/consumers/slack-archive-channel.consumer';
import { SlackCommunicationConsumer } from 'src/modules/communication/consumers/slack-communication.consumer';
import { SlackArchiveChannelProducer } from 'src/modules/communication/producers/slack-archive-channel.producer';
import { SlackCommunicationProducer } from 'src/modules/communication/producers/slack-communication.producer';
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
					}),
					BullModule.registerQueue({
						name: SlackArchiveChannelProducer.QUEUE_NAME,
						defaultJobOptions: {
							attempts: SlackArchiveChannelProducer.ATTEMPTS,
							backoff: SlackArchiveChannelProducer.BACKOFF,
							delay: SlackArchiveChannelProducer.DELAY,
							removeOnFail: SlackArchiveChannelProducer.REMOVE_ON_FAIL,
							removeOnComplete: SlackArchiveChannelProducer.REMOVE_ON_COMPLETE,
							priority: SlackArchiveChannelProducer.PRIORITY
						}
					})
			  ]
			: [])
	],
	providers: [
		CommunicationService,
		ArchiveChannelService,
		...(configuration().slack.enable
			? [
					CommunicationGateAdapter,
					ChatHandler,
					ConversationsHandler,
					UsersHandler,
					CommunicationApplication,
					ArchiveChannelApplication,
					ResponsibleApplication,
					MergeBoardApplication,
					SlackCommunicationProducer,
					SlackCommunicationConsumer,
					SlackResponsibleProducer,
					SlackResponsibleConsumer,
					SlackMergeBoardProducer,
					SlackMergeBoardConsumer,
					SlackArchiveChannelProducer,
					SlackArchiveChannelConsumer
			  ]
			: [])
	],
	exports: [CommunicationService, ArchiveChannelService]
})
export class CommunicationModule {}

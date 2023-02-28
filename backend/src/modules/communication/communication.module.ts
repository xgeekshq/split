import { BullModule } from '@nestjs/bull';
import { Module, forwardRef } from '@nestjs/common';
import { configuration } from 'src/infrastructure/config/configuration';
import BoardsModule from 'src/modules/boards/boards.module';
import {
	AddUserIntoChannelApplication,
	ArchiveChannelApplication,
	ArchiveChannelService,
	ChatHandler,
	CommunicationApplication,
	CommunicationGateAdapter,
	CommunicationService,
	ConversationsHandler,
	MergeBoardApplication,
	ResponsibleApplication,
	SendMessageApplication,
	SendMessageService,
	UsersHandler
} from 'src/modules/communication/communication.providers';
import { SlackArchiveChannelConsumer } from 'src/modules/communication/consumers/slack-archive-channel.consumer';
import { SlackCommunicationConsumer } from 'src/modules/communication/consumers/slack-communication.consumer';
import { SlackArchiveChannelProducer } from 'src/modules/communication/producers/slack-archive-channel.producer';
import { SlackCommunicationProducer } from 'src/modules/communication/producers/slack-communication.producer';
import { SlackAddUserToChannelConsumer } from './consumers/slack-add-user-channel.consummer';
import { SlackMergeBoardConsumer } from './consumers/slack-merge-board.consumer';
import { SlackResponsibleConsumer } from './consumers/slack-responsible.consumer';
import { SlackSendMessageConsumer } from './consumers/slack-send-message.consumer';
import { SlackAddUserToChannelProducer } from './producers/slack-add-user-channel.producer';
import { SlackMergeBoardProducer } from './producers/slack-merge-board.producer';
import { SlackResponsibleProducer } from './producers/slack-responsible.producer';
import { SlackSendMessageProducer } from './producers/slack-send-message-channel.producer';

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
					}),
					BullModule.registerQueue({
						name: SlackAddUserToChannelProducer.QUEUE_NAME,
						defaultJobOptions: {
							attempts: SlackAddUserToChannelProducer.ATTEMPTS,
							backoff: SlackAddUserToChannelProducer.BACKOFF,
							delay: SlackAddUserToChannelProducer.DELAY,
							removeOnFail: SlackAddUserToChannelProducer.REMOVE_ON_FAIL,
							removeOnComplete: SlackAddUserToChannelProducer.REMOVE_ON_COMPLETE,
							priority: SlackAddUserToChannelProducer.PRIORITY
						}
					}),
					BullModule.registerQueue({
						name: SlackSendMessageProducer.QUEUE_NAME,
						defaultJobOptions: {
							attempts: SlackSendMessageProducer.ATTEMPTS,
							backoff: SlackSendMessageProducer.BACKOFF,
							delay: SlackSendMessageProducer.DELAY,
							removeOnFail: SlackSendMessageProducer.REMOVE_ON_FAIL,
							removeOnComplete: SlackSendMessageProducer.REMOVE_ON_COMPLETE,
							priority: SlackSendMessageProducer.PRIORITY
						}
					})
			  ]
			: [])
	],
	providers: [
		CommunicationService,
		ArchiveChannelService,
		SendMessageService,
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
					AddUserIntoChannelApplication,
					SendMessageApplication,
					SlackSendMessageConsumer,
					SlackSendMessageProducer,
					SlackCommunicationProducer,
					SlackCommunicationConsumer,
					SlackResponsibleProducer,
					SlackResponsibleConsumer,
					SlackMergeBoardProducer,
					SlackMergeBoardConsumer,
					SlackArchiveChannelProducer,
					SlackArchiveChannelConsumer,
					SlackAddUserToChannelConsumer,
					SlackAddUserToChannelProducer
			  ]
			: [])
	],
	exports: [CommunicationService, ArchiveChannelService, SendMessageService]
})
export class CommunicationModule {}

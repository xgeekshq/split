import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';

import { configuration } from 'infrastructure/config/configuration';
import BoardsModule from 'modules/boards/boards.module';
import {
	ChatHandler,
	CommunicationGateAdapter,
	ConversationsHandler,
	ExecuteCommunication,
	ExecuteCommunicationService,
	ResponsibleExecuteCommunication,
	UsersHandler
} from 'modules/communication/communication.providers';
import { SlackCommunicationConsumer } from 'modules/communication/consumers/slack-communication.consumer';
import { SlackCommunicationProducer } from 'modules/communication/producers/slack-communication.producer';

import { SlackResponsibleCommunicationConsumer } from './consumers/slack-responsible-communication.consumer';
import { SlackResponsibleCommunicationProducer } from './producers/slack-responsible-communication.producer';

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
						name: SlackResponsibleCommunicationProducer.QUEUE_NAME,
						defaultJobOptions: {
							attempts: SlackResponsibleCommunicationProducer.ATTEMPTS,
							backoff: SlackResponsibleCommunicationProducer.BACKOFF,
							delay: SlackResponsibleCommunicationProducer.DELAY,
							removeOnFail: SlackResponsibleCommunicationProducer.REMOVE_ON_FAIL,
							removeOnComplete: SlackResponsibleCommunicationProducer.REMOVE_ON_COMPLETE,
							priority: SlackResponsibleCommunicationProducer.PRIORITY
						}
					})
			  ]
			: [])
	],
	providers: [
		ExecuteCommunicationService,
		...(configuration().slack.enable
			? [
					CommunicationGateAdapter,
					ChatHandler,
					ConversationsHandler,
					UsersHandler,
					ExecuteCommunication,
					ResponsibleExecuteCommunication,
					SlackCommunicationProducer,
					SlackCommunicationConsumer,
					SlackResponsibleCommunicationProducer,
					SlackResponsibleCommunicationConsumer
			  ]
			: [])
	],
	exports: [ExecuteCommunicationService, ResponsibleExecuteCommunication]
})
export class CommunicationModule {}

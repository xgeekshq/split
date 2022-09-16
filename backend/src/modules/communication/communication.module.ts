import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { join } from 'path';

import BoardsModule from 'modules/boards/boards.module';
import {
	ChatHandler,
	CommunicationGateAdapter,
	ConversationsHandler,
	ExecuteCommunication,
	ExecuteCommunicationService,
	UsersHandler
} from 'modules/communication/communication.providers';
import { CommunicationProducerService } from 'modules/communication/producers/slack-communication.producer.service';

@Module({
	imports: [
		forwardRef(() => BoardsModule),
		BullModule.registerQueueAsync({
			name: CommunicationProducerService.QUEUE_NAME,
			useFactory: async () => ({
				name: CommunicationProducerService.QUEUE_NAME,
				processors: [join(__dirname, 'consumers', 'slack-consumer.processor')]
			})
		})
	],
	providers: [
		ExecuteCommunicationService,
		CommunicationGateAdapter,
		ChatHandler,
		ConversationsHandler,
		UsersHandler,
		ExecuteCommunication,
		CommunicationProducerService
	],
	exports: [ExecuteCommunicationService]
})
export class CommunicationModule {}

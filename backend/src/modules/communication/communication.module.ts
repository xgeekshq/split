import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { join } from 'path';

import BoardsModule from 'modules/boards/boards.module';
import {
	ChatHandler,
	CommunicationGateAdapter,
	ConversationsHandler,
	ExecuteCommunication,
	UsersHandler
} from 'modules/communication/communication.providers';
import { CommunicationProducerService } from 'modules/communication/producers/slack-communication.producer.service';
import { SlackExecuteCommunicationService } from 'modules/communication/services/slack-execute-communication.service';

@Module({
	imports: [
		BoardsModule,
		BullModule.registerQueueAsync({
			name: CommunicationProducerService.QUEUE_NAME,
			useFactory: async () => ({
				name: CommunicationProducerService.QUEUE_NAME,
				processors: [join(__dirname, '..', 'communication', 'consumers', 'processor')]
			})
		})
	],
	providers: [
		SlackExecuteCommunicationService,
		CommunicationGateAdapter,
		ChatHandler,
		ConversationsHandler,
		UsersHandler,
		ExecuteCommunication,
		CommunicationProducerService
	],
	exports: [SlackExecuteCommunicationService]
})
export class CommunicationModule {}

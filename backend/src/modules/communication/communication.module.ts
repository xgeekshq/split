import { Module } from '@nestjs/common';

import BoardsModule from 'modules/boards/boards.module';
import {
	ChatHandler,
	CommunicationGateAdapter,
	ConversationsHandler,
	ExecuteCommunication,
	UsersHandler
} from 'modules/communication/communication.providers';
import { SlackExecuteCommunicationService } from 'modules/communication/services/slack-execute-communication.service';
import { QueueModule } from 'modules/queue/queue.module';

@Module({
	imports: [BoardsModule, QueueModule],
	providers: [
		SlackExecuteCommunicationService,
		CommunicationGateAdapter,
		ChatHandler,
		ConversationsHandler,
		UsersHandler,
		ExecuteCommunication
	],
	exports: [SlackExecuteCommunicationService]
})
export class CommunicationModule {}

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

@Module({
	imports: [BoardsModule],
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

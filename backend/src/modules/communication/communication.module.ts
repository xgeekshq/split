import { Module } from '@nestjs/common';

import BoardsModule from 'modules/boards/boards.module';
import {
	CommunicationGateAdapter,
	ChatHandler,
	ConversationsHandler,
	UsersHandler,
	ExecuteCommunication
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

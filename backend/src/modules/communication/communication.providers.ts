import { ConfigService } from '@nestjs/config';

import { configuration } from 'infrastructure/config/configuration';
import { FRONTEND_URL } from 'libs/constants/frontend';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'libs/constants/slack';
import { SlackCommunicationGateAdapter } from 'modules/communication/adapters/slack-communication-gate.adapter';
import { SlackCommunicationApplication } from 'modules/communication/applications/slack-communication.application';
import { SlackMergeBoardApplication } from 'modules/communication/applications/slack-merge-board.application';
import { SlackResponsibleApplication } from 'modules/communication/applications/slack-responsible.application';
import { ChatSlackHandler } from 'modules/communication/handlers/chat-slack.handler';
import { ConversationsSlackHandler } from 'modules/communication/handlers/conversations-slack.handler';
import { ChatHandlerInterface } from 'modules/communication/interfaces/chat.handler.interface';
import { CommunicationGateAdapterInterface } from 'modules/communication/interfaces/communication-gate.adapter.interface';
import { ConversationsHandlerInterface } from 'modules/communication/interfaces/conversations.handler.interface';
import { TYPES } from 'modules/communication/interfaces/types';
import { UsersHandlerInterface } from 'modules/communication/interfaces/users.handler.interface';
import { SlackCommunicationService } from 'modules/communication/services/slack-communication.service';
import { SlackDisabledCommunicationService } from 'modules/communication/services/slack-disabled-communication.service';

import { UsersSlackHandler } from './handlers/users-slack.handler';

export const CommunicationGateAdapter = {
	provide: SlackCommunicationGateAdapter,
	useFactory: (configService: ConfigService) => {
		return new SlackCommunicationGateAdapter({
			slackApiBotToken: configService.getOrThrow(SLACK_API_BOT_TOKEN),
			slackMasterChannelId: configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
			slackChannelPrefix: configService.getOrThrow(SLACK_CHANNEL_PREFIX),
			frontendUrl: configService.getOrThrow(FRONTEND_URL)
		});
	},
	inject: [ConfigService]
};

export const ConversationsHandler = {
	provide: ConversationsSlackHandler,
	useFactory: (communicationGateAdapter: CommunicationGateAdapterInterface) => {
		return new ConversationsSlackHandler(communicationGateAdapter);
	},
	inject: [SlackCommunicationGateAdapter]
};

export const UsersHandler = {
	provide: UsersSlackHandler,
	useFactory: (communicationGateAdapter: CommunicationGateAdapterInterface) => {
		return new UsersSlackHandler(communicationGateAdapter);
	},
	inject: [SlackCommunicationGateAdapter]
};

export const ChatHandler = {
	provide: ChatSlackHandler,
	useFactory: (communicationGateAdapter: CommunicationGateAdapterInterface) => {
		return new ChatSlackHandler(communicationGateAdapter);
	},
	inject: [SlackCommunicationGateAdapter]
};

export const CommunicationApplication = {
	provide: TYPES.application.SlackCommunicationApplication,
	useFactory: (
		configService: ConfigService,
		conversationsHandler: ConversationsHandlerInterface,
		usersHandler: UsersHandlerInterface,
		chatHandler: ChatHandlerInterface
	) => {
		return new SlackCommunicationApplication(
			{
				slackApiBotToken: configService.getOrThrow(SLACK_API_BOT_TOKEN),
				slackMasterChannelId: configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
				slackChannelPrefix: configService.getOrThrow(SLACK_CHANNEL_PREFIX),
				frontendUrl: configService.getOrThrow(FRONTEND_URL)
			},
			conversationsHandler,
			usersHandler,
			chatHandler
		);
	},
	inject: [ConfigService, ConversationsSlackHandler, UsersSlackHandler, ChatSlackHandler]
};

export const ResponsibleApplication = {
	provide: TYPES.application.SlackResponsibleApplication,
	useFactory: (
		usersHandler: UsersHandlerInterface,
		chatHandler: ChatHandlerInterface,
		conversationsHandler: ConversationsHandlerInterface
	) => {
		return new SlackResponsibleApplication(chatHandler, usersHandler, conversationsHandler);
	},
	inject: [UsersSlackHandler, ChatSlackHandler, ConversationsSlackHandler]
};

export const MergeBoardApplication = {
	provide: TYPES.application.SlackMergeBoardApplication,
	useFactory: (configService: ConfigService, chatHandler: ChatHandlerInterface) => {
		return new SlackMergeBoardApplication(chatHandler, configService.getOrThrow(FRONTEND_URL));
	},
	inject: [ConfigService, ChatSlackHandler]
};

export const CommunicationService = {
	provide: TYPES.services.SlackCommunicationService,
	useClass: configuration().slack.enable
		? SlackCommunicationService
		: SlackDisabledCommunicationService
};

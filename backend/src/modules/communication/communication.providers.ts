import { ConfigService } from '@nestjs/config';

import { SlackCommunicationGateAdapter } from 'src/modules/communication/adapters/slack-communication-gate.adapter';
import { ConversationsSlackHandler } from 'src/modules/communication/handlers/conversations-slack.handler';
import { UsersSlackHandler } from 'src/modules/communication/handlers/users-slack.handler';
import { ChatSlackHandler } from 'src/modules/communication/handlers/chat-slack.handler';
import { SlackExecuteCommunication } from 'src/modules/communication/applications/slack-execute-communication.application';
import { CommunicationGateInterface } from 'src/modules/communication/interfaces/communication-gate.interface';
import { ConversationsHandlerInterface } from 'src/modules/communication/interfaces/conversations.handler.interface';
import { UsersHandlerInterface } from 'src/modules/communication/interfaces/users.handler.interface';
import { ChatHandlerInterface } from 'src/modules/communication/interfaces/chat.handler.interface';

export const CommunicationGateAdapter = {
  provide: SlackCommunicationGateAdapter,
  useFactory: (configService: ConfigService) => {
    return new SlackCommunicationGateAdapter(configService);
  },
  inject: [ConfigService],
};

export const ConversationsHandler = {
  provide: ConversationsSlackHandler,
  useFactory: (communicationGateAdapter: CommunicationGateInterface) => {
    return new ConversationsSlackHandler(communicationGateAdapter);
  },
  inject: [SlackCommunicationGateAdapter],
};

export const UsersHandler = {
  provide: UsersSlackHandler,
  useFactory: (communicationGateAdapter: CommunicationGateInterface) => {
    return new UsersSlackHandler(communicationGateAdapter);
  },
  inject: [SlackCommunicationGateAdapter],
};

export const ChatHandler = {
  provide: ChatSlackHandler,
  useFactory: (communicationGateAdapter: CommunicationGateInterface) => {
    return new ChatSlackHandler(communicationGateAdapter);
  },
  inject: [SlackCommunicationGateAdapter],
};

export const ExecuteCommunication = {
  provide: SlackExecuteCommunication,
  useFactory: (
    configService: ConfigService,
    conversationsHandler: ConversationsHandlerInterface,
    usersHandler: UsersHandlerInterface,
    chatHandler: ChatHandlerInterface,
  ) => {
    return new SlackExecuteCommunication(
      configService,
      conversationsHandler,
      usersHandler,
      chatHandler,
    );
  },
  inject: [
    ConfigService,
    ConversationsSlackHandler,
    UsersSlackHandler,
    ChatSlackHandler,
  ],
};

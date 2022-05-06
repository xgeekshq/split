import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import DatabaseModule from './infrastructure/database/database.module';
import UsersModule from './modules/users/users.module';
import AuthModule from './modules/auth/auth.module';
import BoardsModule from './modules/boards/boards.module';
import SocketModule from './modules/socket/socket.module';
import { CardsModule } from './modules/cards/cards.module';
import { CommentsModule } from './modules/comments/comments.module';
import AppConfigModule from './infrastructure/config/config.module';
import { VotesModule } from './modules/votes/votes.module';
import { configuration } from './infrastructure/config/configuration';
import AzureModule from './modules/azure/azure.module';
import TeamsModule from './modules/teams/teams.module';
import EmailModule from './modules/mailer/mailer.module';
import {
  mongooseResetModule,
  mongooseUserModule,
} from './infrastructure/database/mongoose.module';
import { CommunicationModule } from './modules/communication/communication.module';

const imports = [
  AppConfigModule,
  DatabaseModule,
  UsersModule,
  AuthModule,
  BoardsModule,
  SocketModule,
  CardsModule,
  CommentsModule,
  VotesModule,
  EmailModule,
  TeamsModule,
  mongooseResetModule,
  mongooseUserModule,
  ScheduleModule.forRoot(),
];

if (configuration().azure.enabled) {
  imports.push(AzureModule);
}

if (configuration().smtp.enabled) {
  imports.push(EmailModule);
}
if (configuration().slack.enable) {
  imports.push(CommunicationModule);
}

@Module({
  imports,
  controllers: [],
  providers: [],
})
export default class AppModule {}

import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import AppConfigModule from 'src/infrastructure/config/config.module';
import { configuration } from 'src/infrastructure/config/configuration';
import DatabaseModule from 'src/infrastructure/database/database.module';
import {
	mongooseResetModule,
	mongooseUserModule
} from 'src/infrastructure/database/mongoose.module';
import AuthModule from 'src/modules/auth/auth.module';
import AzureModule from 'src/modules/azure/azure.module';
import BoardsModule from 'src/modules/boards/boards.module';
import { CardsModule } from 'src/modules/cards/cards.module';
import { CommentsModule } from 'src/modules/comments/comments.module';
import { CommunicationModule } from 'src/modules/communication/communication.module';
import EmailModule from 'src/modules/mailer/mailer.module';
import { QueueModule } from 'src/modules/queue/queue.module';
import SocketModule from 'src/modules/socket/socket.module';
import TeamsModule from 'src/modules/teams/teams.module';
import UsersModule from 'src/modules/users/users.module';
import { VotesModule } from 'src/modules/votes/votes.module';
import { ColumnsModule } from './modules/columns/columns.module';

const imports = [
	AppConfigModule,
	DatabaseModule,
	UsersModule,
	AuthModule,
	BoardsModule,
	SocketModule,
	CardsModule,
	ColumnsModule,
	CommentsModule,
	VotesModule,
	EmailModule,
	TeamsModule,
	mongooseResetModule,
	mongooseUserModule,
	ScheduleModule.forRoot(),
	QueueModule,
	EventEmitterModule.forRoot()
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
	providers: []
})
export default class AppModule {}

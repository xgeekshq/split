import { Module } from '@nestjs/common';
import DatabaseModule from './infrastructure/database/database.module';
import UsersModule from './modules/users/users.module';
import AuthModule from './modules/auth/auth.module';
import BoardsModule from './modules/boards/boards.module';
import SocketModule from './modules/socket/socket.module';
import { CardsModule } from './modules/cards/cards.module';
import { CommentsModule } from './modules/comments/comments.module';
import AppConfigModule from './infrastructure/config/config.module';
import { VotesModule } from './modules/votes/votes.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    BoardsModule,
    SocketModule,
    CardsModule,
    CommentsModule,
    VotesModule,
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}

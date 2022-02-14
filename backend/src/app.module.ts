import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import DatabaseModule from './infrastructure/database/database.module';
import UsersModule from './modules/users/users.module';
import AuthModule from './modules/auth/auth.module';
import BoardsModule from './modules/boards/boards.module';
import SocketModule from './modules/socket/socket.module';
import { configuration } from './infrastructure/config/configuration';
import { CardsModule } from './modules/cards/cards.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        BACKEND_PORT: Joi.number().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    BoardsModule,
    SocketModule,
    CardsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}

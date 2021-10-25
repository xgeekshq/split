import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './boards/board.entity';
import { BoardsController } from './boards/boards.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.local.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: '127.0.0.1',
      port: 27017,
      username: process.env.DBUSER,
      password: process.env.DB_ROOT_PASSWORD,
      database: 'dc',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      useUnifiedTopology: true,
    }),
    TypeOrmModule.forFeature([Board]),
  ],
  controllers: [AppController, BoardsController],
  providers: [AppService],
})
export class AppModule {}

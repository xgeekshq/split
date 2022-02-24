import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_URI } from '../../libs/constants/database';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(DATABASE_URI),
      }),
      inject: [ConfigService],
    }),
  ],
})
export default class DatabaseModule {}

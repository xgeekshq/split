import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('DB_USER')}:${configService.get(
          'DB_PASSWORD',
        )}@${configService.get('DB_HOST')}:${configService.get(
          'DB_PORT',
        )}/${configService.get('DB_NAME')}`,
      }),
      inject: [ConfigService],
    }),
  ],
})
export default class DatabaseModule {}

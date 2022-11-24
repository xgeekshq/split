import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_URI_KEY } from 'src/libs/constants/database';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get(DATABASE_URI_KEY)
			}),
			inject: [ConfigService]
		})
	]
})
export default class DatabaseModule {}

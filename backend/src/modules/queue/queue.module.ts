import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { CommunicationProducerService } from 'modules/communication/producers/slack-communication.producer.service';

@Module({
	imports: [
		BullModule.registerQueueAsync({
			name: CommunicationProducerService.QUEUE_NAME,
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				redis: {
					username: configService.get('redis.user'),
					password: configService.get('redis.password'),
					host: configService.get('redis.host'),
					port: configService.get('redis.port')
				},
				name: CommunicationProducerService.QUEUE_NAME,
				processors: [join(__dirname, '..', 'communication', 'consumers', 'processor')]
			}),
			inject: [ConfigService]
		})
	],
	providers: [CommunicationProducerService],
	exports: [BullModule, CommunicationProducerService]
})
export class QueueModule {}

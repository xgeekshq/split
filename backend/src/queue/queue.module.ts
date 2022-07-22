import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CommunicationConsumer } from './consumers/communication.consumer';
import { CommunicationProducerService } from './producers/communication.producer.service';

@Module({
	imports: [
		BullModule.registerQueueAsync({
			name: CommunicationProducerService.QUEUE_NAME,
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				name: CommunicationProducerService.QUEUE_NAME,
				redis: {
					username: configService.get('redis.user'),
					password: configService.get('redis.password'),
					host: configService.get('redis.host'),
					port: configService.get('redis.port')
				}
				/* processors: [
          join(__dirname, 'consumers', 'slack.cosnumer.processor.js'),
        ], */
			}),
			inject: [ConfigService]
		})
	],
	providers: [CommunicationProducerService, CommunicationConsumer],
	exports: [CommunicationProducerService]
})
export class QueueModule {}

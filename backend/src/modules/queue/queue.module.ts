import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				redis: {
					// username: configService.get('redis.user'),
					// password: configService.get('redis.password'),
					host: configService.get('redis.host'),
					port: configService.get('redis.port'),
					...(process.env.NODE_ENV === 'prod'
						? {
								tls: {
									host: configService.get('redis.host')
								}
						  }
						: null)
				}
			})
		})
	],
	exports: [BullModule]
})
export class QueueModule {}

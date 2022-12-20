import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				redis: {
					password: configService.get('redis.password'),
					host: configService.get('redis.host'),
					port: configService.get('redis.port'),
					...(process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'dev'
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

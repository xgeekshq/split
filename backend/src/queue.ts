import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { QueueModule } from './queue/queue.module';

async function bootstrap() {
	const logger: Logger = new Logger('QueueModule');

	const app = await NestFactory.create(QueueModule);
	logger.log(`Queue is running`);
	app.init();
}
bootstrap();

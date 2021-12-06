import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import AppModule from './app.module';
import { PORT } from './constants/config';

async function bootstrap() {
  const logger: Logger = new Logger('AppGateway');
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(PORT);
  logger.log(`Application is running at http://localhost:${PORT}`);
}
bootstrap();

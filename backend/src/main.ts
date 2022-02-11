import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import AppModule from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('AppGateway');

  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = configService.get('server.port');
  await app.listen(port);

  logger.log(`Application is running at http://localhost:${port}`);
}
bootstrap();

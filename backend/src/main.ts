import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import AppModule from './app.module';
import PORT from './constants/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(PORT);
}
bootstrap();

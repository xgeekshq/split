import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import AppModule from './app.module';

async function bootstrap() {
	const logger: Logger = new Logger('AppGateway');

	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const port = configService.get('server.port');

	/**
	 * Swagger Documentation
	 */
	const config = new DocumentBuilder()
		.setTitle('SPLIT')
		.setDescription('Backend documentation for SPLIT project')
		.setVersion('0.0.1')
		.setLicense('MIT', 'https://github.com/xgeekshq/split/blob/main/LICENSE')
		.setExternalDoc('More about the project', 'https://github.com/xgeekshq/split')
		.addBearerAuth(
			{
				description: 'Please enter the access token you received when logged in.',
				name: 'Authorization',
				bearerFormat: 'Bearer',
				scheme: 'Bearer',
				type: 'http',
				in: 'Header'
			},
			'access-token'
		)
		.addBearerAuth(
			{
				description: 'Please enter the refresh token you received when logged in.',
				name: 'Authorization',
				bearerFormat: 'Bearer',
				scheme: 'Bearer',
				type: 'http',
				in: 'Header'
			},
			'refresh-token'
		)
		.setExternalDoc('Download Collection', 'docs-json')
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('docs', app, document, {
		swaggerOptions: {
			// set sorting method for tag
			tagsSorter: 'alpha',
			// enable search input to filter
			filter: true
		}
	});

	/**
	 * Cors configuration
	 */
	app.enableCors();

	await app
		.useGlobalPipes(
			new ValidationPipe({
				transform: true
			})
		)
		.listen(port);

	logger.log(`Application is running at http://localhost:${port}`);
}

bootstrap();

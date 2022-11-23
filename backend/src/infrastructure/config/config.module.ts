import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { configuration } from './configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
			load: [configuration],
			validationSchema: Joi.object({
				NODE_ENV: Joi.string().valid('dev', 'prod', 'test', 'staging', 'local').default('local'),
				DB_HOST: Joi.string().required(),
				DB_USER: Joi.string().required(),
				DB_PASSWORD: Joi.string().required(),
				DB_NAME: Joi.string().required(),
				DB_PORT: Joi.any().when('NODE_ENV', {
					is: 'local',
					then: Joi.required(),
					otherwise: Joi.optional()
				}),
				DB_REPLICA_SET: Joi.any().when('NODE_ENV', {
					is: 'local',
					then: Joi.required(),
					otherwise: Joi.optional()
				}),
				BACKEND_PORT: Joi.number().required(),
				JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
				JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
				JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
				JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
				AZURE_ENABLE: Joi.string().required(),
				AZURE_CLIENT_ID: Joi.any().when('AZURE_ENABLE', {
					is: 'true',
					then: Joi.required()
				}),
				AZURE_CLIENT_SECRET: Joi.any().when('AZURE_ENABLE', {
					is: 'true',
					then: Joi.required()
				}),
				AZURE_TENANT_ID: Joi.any().when('AZURE_ENABLE', {
					is: 'true',
					then: Joi.required()
				}),
				SMTP_ENABLE: Joi.string().required(),
				SMTP_HOST: Joi.any().when('SMTP_ENABLE', {
					is: 'true',
					then: Joi.required()
				}),
				SMTP_PORT: Joi.any().when('SMTP_ENABLE', {
					is: 'true',
					then: Joi.string().required()
				}),
				SMTP_USER: Joi.any().when('SMTP_ENABLE', {
					is: 'true',
					then: Joi.required()
				}),
				SMTP_PASSWORD: Joi.any().when('SMTP_ENABLE', {
					is: 'true',
					then: Joi.required()
				}),
				NEXT_PUBLIC_NEXTAUTH_URL: Joi.string().required(),
				SLACK_ENABLE: Joi.string().required(),
				SLACK_API_BOT_TOKEN: Joi.string().when('SLACK_ENABLE', {
					is: 'true',
					then: Joi.required(),
					otherwise: Joi.optional()
				}),
				SLACK_MASTER_CHANNEL_ID: Joi.string().when('SLACK_ENABLE', {
					is: 'true',
					then: Joi.required(),
					otherwise: Joi.optional()
				}),
				SLACK_CHANNEL_PREFIX: Joi.string().when('SLACK_ENABLE', {
					is: 'true',
					then: Joi.required(),
					otherwise: Joi.optional()
				}),
				REDIS_USER: Joi.string(),
				REDIS_PASSWORD: Joi.string(),
				REDIS_HOST: Joi.string().required(),
				REDIS_PORT: Joi.number().required()
			})
		})
	],
	providers: [ConfigService],
	exports: [ConfigService]
})
export default class AppConfigModule {}

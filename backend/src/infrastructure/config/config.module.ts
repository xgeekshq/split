import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { configuration } from './configuration';

const NODE_ENV = process.env.NODE_ENV;
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: !NODE_ENV || NODE_ENV === 'dev' ? '../.env' : `.env.${NODE_ENV}`,
			load: [configuration],
			validationSchema: Joi.object({
				NODE_ENV: Joi.string().valid('dev', 'prod', 'test', 'staging').default('dev'),
				DB_HOST: Joi.string().required(),
				DB_USER: Joi.string().required(),
				DB_PASSWORD: Joi.string().required(),
				DB_NAME: Joi.string().required(),
				DB_PORT: Joi.any().when('NODE_ENV', {
					is: 'dev',
					then: Joi.required(),
					otherwise: Joi.optional()
				}),
				DB_REPLICA_SET: Joi.any().when('NODE_ENV', {
					is: 'dev',
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
				SLACK_API_BOT_TOKEN: Joi.string().when('SLACK_API_BOT_TOKEN', {
					is: 'true',
					then: Joi.required(),
					otherwise: Joi.optional()
				}),
				SLACK_CHANNEL_SUFFIX: Joi.string().when('SLACK_CHANNEL_SUFFIX', {
					is: 'true',
					then: Joi.required(),
					otherwise: Joi.optional()
				})
			})
		})
	],
	providers: [ConfigService],
	exports: [ConfigService]
})
export default class AppConfigModule {}

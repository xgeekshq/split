import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { configuration } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_REPLICA_SET: Joi.string().required(),
        BACKEND_PORT: Joi.number().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        AZURE_ENABLE: Joi.string().required(),
        AZURE_CLIENT_ID: Joi.any().when('AZURE_ENABLE', {
          is: 'true',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        AZURE_CLIENT_SECRET: Joi.any().when('AZURE_ENABLE', {
          is: 'true',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        AZURE_TENANT_ID: Joi.any().when('AZURE_ENABLE', {
          is: 'true',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export default class AppConfigModule {}

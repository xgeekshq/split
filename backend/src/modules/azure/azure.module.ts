import { Module } from '@nestjs/common';
import AuthModule from '../auth/auth.module';
import UsersModule from '../users/users.module';
import {
  cronAzureService,
  authAzureApplication,
  authAzureService,
} from './azure.providers';
import AzureController from './controller/azure.controller';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AzureController],
  providers: [cronAzureService, authAzureService, authAzureApplication],
})
export default class AzureModule {}

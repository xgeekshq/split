import { Module } from '@nestjs/common';
import AuthModule from '../auth/auth.module';
import { CommunicationModule } from '../communication/communication.module';
import UsersModule from '../users/users.module';
import { authAzureApplication, authAzureService, cronAzureService } from './azure.providers';
import AzureController from './controller/azure.controller';

@Module({
	imports: [UsersModule, AuthModule, CommunicationModule],
	controllers: [AzureController],
	providers: [cronAzureService, authAzureService, authAzureApplication]
})
export default class AzureModule {}

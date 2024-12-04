import { Module } from '@nestjs/common';
import AuthModule from '../auth/auth.module';
import { CommunicationModule } from '../communication/communication.module';
import { StorageModule } from '../storage/storage.module';
import UsersModule from '../users/users.module';
import {
	authAzureService,
	checkUserUseCase,
	registerOrLoginUseCase,
	synchronizeADUsersCronUseCase
} from './azure.providers';
import AzureController from './controller/azure.controller';
import { JwtRegister } from 'src/infrastructure/config/jwt.register';
import TeamsModule from '../teams/teams.module';
import TeamUsersModule from '../teamUsers/teamusers.module';

@Module({
	imports: [
		UsersModule,
		AuthModule,
		CommunicationModule,
		StorageModule,
		JwtRegister,
		TeamsModule,
		TeamUsersModule
	],
	controllers: [AzureController],
	providers: [
		authAzureService,
		checkUserUseCase,
		registerOrLoginUseCase,
		synchronizeADUsersCronUseCase
	]
})
export default class AzureModule {}

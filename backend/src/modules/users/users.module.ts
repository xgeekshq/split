import { Module } from '@nestjs/common';
import {
	mongooseResetModule,
	mongooseUserModule
} from 'src/infrastructure/database/mongoose.module';
import TeamsModule from 'src/modules/teams/teams.module';
import UsersController from './controller/users.controller';
import {
	createUserService,
	getUserApplication,
	getUserService,
	updateUserApplication,
	updateUserService
} from './users.providers';

@Module({
	imports: [mongooseUserModule, mongooseResetModule, TeamsModule],
	providers: [
		createUserService,
		getUserService,
		updateUserService,
		updateUserApplication,
		getUserApplication
	],
	controllers: [UsersController],
	exports: [
		createUserService,
		getUserService,
		updateUserService,
		updateUserApplication,
		getUserApplication
	]
})
export default class UsersModule {}

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
	updateUserService,
	userRepository
} from './users.providers';

@Module({
	imports: [mongooseUserModule, TeamsModule, mongooseResetModule],
	providers: [
		createUserService,
		getUserService,
		updateUserService,
		updateUserApplication,
		getUserApplication,
		userRepository
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

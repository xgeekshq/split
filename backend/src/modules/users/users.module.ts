import { Module } from '@nestjs/common';
import {
	mongooseResetModule,
	mongooseTeamUserModule,
	mongooseUserModule
} from 'src/infrastructure/database/mongoose.module';
import TeamsModule from 'src/modules/teams/teams.module';
import UsersController from './controller/users.controller';
import {
	createUserService,
	deleteUserApplication,
	deleteUserService,
	getUserApplication,
	getUserService,
	updateUserApplication,
	updateUserService,
	userRepository
} from './users.providers';
import TeamUsersModule from '../teamusers/teamusers.module';

@Module({
	imports: [
		mongooseUserModule,
		TeamsModule,
		TeamUsersModule,
		mongooseResetModule,
		mongooseTeamUserModule
	],
	providers: [
		createUserService,
		getUserService,
		updateUserService,
		updateUserApplication,
		getUserApplication,
		userRepository,
		deleteUserService,
		deleteUserApplication
	],
	controllers: [UsersController],
	exports: [
		createUserService,
		getUserService,
		updateUserService,
		updateUserApplication,
		getUserApplication,
		deleteUserService,
		deleteUserApplication
	]
})
export default class UsersModule {}

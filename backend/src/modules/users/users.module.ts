import { Module } from '@nestjs/common';

import { mongooseResetModule, mongooseUserModule } from 'infrastructure/database/mongoose.module';
import TeamsModule from 'modules/teams/teams.module';

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
	exports: [
		createUserService,
		getUserService,
		updateUserService,
		updateUserApplication,
		getUserApplication
	]
})
export default class UsersModule {}

import {
	teamUserRepository,
	createTeamUserService,
	getTeamUserService,
	updateTeamUserService,
	deleteTeamUserService,
	createTeamUserApplication,
	getTeamUserApplication,
	updateTeamUserApplication,
	deleteTeamUserApplication
} from './teamusers.providers';
import { Module } from '@nestjs/common';
import { mongooseTeamUserModule } from 'src/infrastructure/database/mongoose.module';

@Module({
	imports: [mongooseTeamUserModule],
	providers: [
		teamUserRepository,
		createTeamUserService,
		getTeamUserService,
		updateTeamUserService,
		deleteTeamUserService,
		createTeamUserApplication,
		getTeamUserApplication,
		updateTeamUserApplication,
		deleteTeamUserApplication
	],
	controllers: [],
	exports: [
		createTeamUserService,
		getTeamUserService,
		updateTeamUserService,
		deleteTeamUserService,
		createTeamUserApplication,
		getTeamUserApplication,
		updateTeamUserApplication,
		deleteTeamUserApplication
	]
})
export default class TeamUsersModule {}

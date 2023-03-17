import {
	addAndRemoveTeamUsersUseCase,
	createTeamUserService,
	createTeamUserUseCase,
	createTeamUsersUseCase,
	deleteTeamUserService,
	deleteTeamUserUseCase,
	getTeamUserService,
	teamUserRepository,
	updateTeamUserService,
	updateTeamUserUseCase
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
		createTeamUserUseCase,
		createTeamUsersUseCase,
		updateTeamUserUseCase,
		addAndRemoveTeamUsersUseCase,
		deleteTeamUserUseCase
	],
	controllers: [],
	exports: [
		createTeamUserService,
		getTeamUserService,
		updateTeamUserService,
		deleteTeamUserService,
		createTeamUserUseCase,
		createTeamUsersUseCase,
		updateTeamUserUseCase,
		addAndRemoveTeamUsersUseCase,
		deleteTeamUserUseCase
	]
})
export default class TeamUsersModule {}

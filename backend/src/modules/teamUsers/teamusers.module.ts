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
import TeamUsersController from './controller/teamUser.controller';

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
		deleteTeamUserUseCase,
		addAndRemoveTeamUsersUseCase
	],
	controllers: [TeamUsersController],
	exports: [
		createTeamUserService,
		getTeamUserService,
		updateTeamUserService,
		deleteTeamUserService,
		createTeamUserUseCase,
		createTeamUsersUseCase,
		updateTeamUserUseCase,
		addAndRemoveTeamUsersUseCase,
		deleteTeamUserUseCase,
		addAndRemoveTeamUsersUseCase
	]
})
export default class TeamUsersModule {}

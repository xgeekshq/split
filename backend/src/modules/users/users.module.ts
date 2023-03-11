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
	getAllUsersUseCase,
	getAllUsersWithTeamsUseCase,
	getUserApplication,
	getUserService,
	getUserUseCase,
	updateSAdminUseCase,
	updateUserApplication,
	updateUserService,
	userRepository
} from './users.providers';

@Module({
	imports: [mongooseUserModule, TeamsModule, mongooseResetModule, mongooseTeamUserModule],
	providers: [
		getAllUsersUseCase,
		getAllUsersWithTeamsUseCase,
		getUserUseCase,
		updateSAdminUseCase,
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

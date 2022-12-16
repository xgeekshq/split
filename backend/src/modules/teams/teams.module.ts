import BoardsModule from 'src/modules/boards/boards.module';
import { Module, forwardRef } from '@nestjs/common';
import {
	mongooseTeamModule,
	mongooseTeamUserModule
} from 'src/infrastructure/database/mongoose.module';
import TeamsController from './controller/team.controller';
import {
	createTeamApplication,
	createTeamService,
	deleteTeamApplication,
	deleteTeamService,
	deleteTeamUserService,
	getTeamApplication,
	getTeamService,
	teamRepository,
	teamUserRepository,
	updateTeamApplication,
	updateTeamService
} from './providers';

@Module({
	imports: [mongooseTeamModule, mongooseTeamUserModule, forwardRef(() => BoardsModule)],
	providers: [
		createTeamService,
		createTeamApplication,
		getTeamService,
		getTeamApplication,
		updateTeamService,
		updateTeamApplication,
		deleteTeamApplication,
		deleteTeamService,
		teamUserRepository,
		teamRepository,
		deleteTeamUserService
	],
	controllers: [TeamsController],
	exports: [
		getTeamApplication,
		getTeamService,
		createTeamService,
		updateTeamService,
		deleteTeamUserService
	]
})
export default class TeamsModule {}

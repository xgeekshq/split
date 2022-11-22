import { forwardRef, Module } from '@nestjs/common';

import {
	mongooseTeamModule,
	mongooseTeamUserModule
} from 'infrastructure/database/mongoose.module';

import BoardsModule from '../boards/boards.module';
import TeamsController from './controller/team.controller';
import {
	createTeamApplication,
	createTeamService,
	getTeamApplication,
	getTeamService,
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
		updateTeamApplication
	],
	controllers: [TeamsController],
	exports: [getTeamApplication, getTeamService, createTeamService, updateTeamService]
})
export default class TeamsModule {}

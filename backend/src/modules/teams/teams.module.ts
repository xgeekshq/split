import BoardsModule from 'src/modules/boards/boards.module';
import { Module, forwardRef } from '@nestjs/common';
import { mongooseTeamModule } from 'src/infrastructure/database/mongoose.module';
import TeamsController from './controller/team.controller';
import {
	createTeamApplication,
	createTeamService,
	deleteTeamApplication,
	deleteTeamService,
	getTeamApplication,
	getTeamService,
	teamRepository
} from './providers';
import TeamUsersModule from 'src/modules/teamUsers/teamusers.module';

@Module({
	imports: [mongooseTeamModule, forwardRef(() => BoardsModule), TeamUsersModule],
	providers: [
		createTeamService,
		createTeamApplication,
		getTeamService,
		getTeamApplication,
		deleteTeamApplication,
		deleteTeamService,
		teamRepository
	],
	controllers: [TeamsController],
	exports: [getTeamApplication, getTeamService, createTeamService]
})
export default class TeamsModule {}

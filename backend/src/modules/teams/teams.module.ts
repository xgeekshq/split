import BoardsModule from 'src/modules/boards/boards.module';
import { Module, forwardRef } from '@nestjs/common';
import { mongooseTeamModule } from 'src/infrastructure/database/mongoose.module';
import TeamsController from './controller/team.controller';
import {
	createTeamUseCase,
	deleteTeamUseCase,
	getAllTeamsUseCase,
	getTeamByNameUseCase,
	getTeamService,
	getTeamUseCase,
	getTeamsOfUserUseCase,
	getTeamsUserIsNotMemberUseCase,
	teamRepository
} from './providers';
import TeamUsersModule from 'src/modules/teamUsers/teamusers.module';

@Module({
	imports: [mongooseTeamModule, forwardRef(() => BoardsModule), TeamUsersModule],
	providers: [
		createTeamUseCase,
		getTeamsUserIsNotMemberUseCase,
		getAllTeamsUseCase,
		getTeamUseCase,
		getTeamsOfUserUseCase,
		deleteTeamUseCase,
		getTeamService,
		teamRepository,
		getTeamByNameUseCase
	],
	controllers: [TeamsController],
	exports: [getTeamService, getTeamByNameUseCase]
})
export default class TeamsModule {}

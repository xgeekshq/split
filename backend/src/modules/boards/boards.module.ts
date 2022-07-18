import { Module } from '@nestjs/common';

import {
	mongooseBoardModule,
	mongooseBoardUserModule
} from 'infrastructure/database/mongoose.module';
import { SchedulesModule } from 'modules/schedules/schedules.module';
import TeamsModule from 'modules/teams/teams.module';
import UsersModule from 'modules/users/users.module';

import {
	createBoardApplication,
	createBoardService,
	deleteBoardApplication,
	deleteBoardService,
	getBoardApplication,
	getBoardService,
	updateBoardApplication,
	updateBoardService
} from './boards.providers';
import BoardsController from './controller/boards.controller';

@Module({
	imports: [
		UsersModule,
		TeamsModule,
		SchedulesModule,
		mongooseBoardModule,
		mongooseBoardUserModule
	],
	providers: [
		createBoardService,
		updateBoardService,
		deleteBoardService,
		getBoardService,
		createBoardApplication,
		updateBoardApplication,
		deleteBoardApplication,
		getBoardApplication
	],
	controllers: [BoardsController],
	exports: [getBoardApplication, createBoardService]
})
export default class BoardsModule {}

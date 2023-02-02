import { Module, forwardRef } from '@nestjs/common';
import {
	mongooseBoardModule,
	mongooseBoardUserModule
} from 'src/infrastructure/database/mongoose.module';
import { CommunicationModule } from 'src/modules/communication/communication.module';
import { SchedulesModule } from 'src/modules/schedules/schedules.module';
import TeamsModule from 'src/modules/teams/teams.module';
import UsersModule from 'src/modules/users/users.module';
import {
	afterUserPausedTimerSubscriber,
	afterUserRequestedTimerStateSubscriber,
	afterUserStartedTimerSubscriber,
	afterUserStoppedTimerSubscriber,
	afterUserUpdatedDurationSubscriber,
	boardTimerRepository,
	createBoardApplication,
	createBoardService,
	deleteBoardApplication,
	deleteBoardService,
	getBoardApplication,
	getBoardService,
	pauseBoardTimerService,
	sendBoardTimerStateService,
	sendBoardTimerTimeLeftService,
	startBoardTimerService,
	stopBoardTimerService,
	updateBoardApplication,
	updateBoardService,
	updateBoardTimerDurationService
} from './boards.providers';
import BoardsController from './controller/boards.controller';

@Module({
	imports: [
		UsersModule,
		forwardRef(() => TeamsModule),
		SchedulesModule,
		CommunicationModule,
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
		getBoardApplication,
		boardTimerRepository,
		sendBoardTimerStateService,
		startBoardTimerService,
		pauseBoardTimerService,
		stopBoardTimerService,
		sendBoardTimerTimeLeftService,
		updateBoardTimerDurationService,
		afterUserPausedTimerSubscriber,
		afterUserStartedTimerSubscriber,
		afterUserStoppedTimerSubscriber,
		afterUserUpdatedDurationSubscriber,
		afterUserRequestedTimerStateSubscriber
	],
	controllers: [BoardsController],
	exports: [
		getBoardApplication,
		createBoardService,
		getBoardService,
		updateBoardService,
		deleteBoardService
	]
})
export default class BoardsModule {}

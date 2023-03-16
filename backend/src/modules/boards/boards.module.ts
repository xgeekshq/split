import AuthModule from 'src/modules/auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import {
	mongooseBoardModule,
	mongooseUserModule
} from 'src/infrastructure/database/mongoose.module';
import { CommunicationModule } from 'src/modules/communication/communication.module';
import { SchedulesModule } from 'src/modules/schedules/schedules.module';
import TeamsModule from 'src/modules/teams/teams.module';
import UsersModule from 'src/modules/users/users.module';
import { CardsModule } from '../cards/cards.module';
import {
	afterUserPausedTimerSubscriber,
	afterUserRequestedTimerStateSubscriber,
	afterUserStartedTimerSubscriber,
	afterUserStoppedTimerSubscriber,
	afterUserUpdatedDurationSubscriber,
	boardRepository,
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
import { JwtRegister } from 'src/infrastructure/config/jwt.register';
import BoardUsersModule from '../boardusers/boardusers.module';

@Module({
	imports: [
		UsersModule,
		forwardRef(() => TeamsModule),
		SchedulesModule,
		CommunicationModule,
		CardsModule,
		forwardRef(() => AuthModule),
		BoardUsersModule,
		JwtRegister,
		mongooseBoardModule,
		mongooseUserModule
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
		afterUserRequestedTimerStateSubscriber,
		boardRepository
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

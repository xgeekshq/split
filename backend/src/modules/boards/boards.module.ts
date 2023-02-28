import AuthModule from 'src/modules/auth/auth.module';
import { getTokenAuthService } from './../auth/auth.providers';
import { userRepository } from 'src/modules/users/users.providers';
import { Module, forwardRef } from '@nestjs/common';
import {
	mongooseBoardModule,
	mongooseBoardUserModule,
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
import PublicBoardsController from './controller/public.boards.controller';
import { JwtRegister } from 'src/infrastructure/config/jwt.register';

@Module({
	imports: [
		UsersModule,
		forwardRef(() => TeamsModule),
		SchedulesModule,
		CommunicationModule,
		CardsModule,
		forwardRef(() => AuthModule),
		JwtRegister,
		mongooseBoardModule,
		mongooseBoardUserModule,
		mongooseUserModule
	],
	providers: [
		getTokenAuthService,
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
		boardRepository,
		userRepository
	],
	controllers: [BoardsController, PublicBoardsController],
	exports: [
		getBoardApplication,
		createBoardService,
		getBoardService,
		updateBoardService,
		deleteBoardService
	]
})
export default class BoardsModule {}

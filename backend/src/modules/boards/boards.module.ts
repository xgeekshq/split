import { JwtRegister } from 'src/infrastructure/config/jwt.register';
import {
	mongooseBoardModule,
	mongooseUserModule
} from 'src/infrastructure/database/mongoose.module';
import AuthModule from 'src/modules/auth/auth.module';
import { CommunicationModule } from 'src/modules/communication/communication.module';
import { SchedulesModule } from 'src/modules/schedules/schedules.module';
import TeamsModule from 'src/modules/teams/teams.module';
import UsersModule from 'src/modules/users/users.module';
import { Module, forwardRef } from '@nestjs/common';
import BoardUsersModule from '../boardUsers/boardusers.module';
import { CardsModule } from '../cards/cards.module';
import {
	afterUserPausedTimerSubscriber,
	afterUserRequestedTimerStateSubscriber,
	afterUserStartedTimerSubscriber,
	afterUserStoppedTimerSubscriber,
	afterUserUpdatedDurationSubscriber,
	boardRepository,
	boardTimerRepository,
	createBoardService,
	createBoardUseCase,
	deleteBoardService,
	deleteBoardUseCase,
	duplicateBoardUseCase,
	getAllBoardsUseCase,
	getBoardService,
	getBoardUseCase,
	getBoardsForDashboardUseCase,
	getPersonalBoardsUseCase,
	isBoardPublicUseCase,
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
import TeamUsersModule from 'src/modules/teamUsers/teamusers.module';
import PublicBoardsController from './controller/publicBoards.controller';

@Module({
	imports: [
		UsersModule,
		forwardRef(() => TeamsModule),
		TeamUsersModule,
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
		duplicateBoardUseCase,
		getBoardsForDashboardUseCase,
		getAllBoardsUseCase,
		getPersonalBoardsUseCase,
		getBoardUseCase,
		createBoardUseCase,
		isBoardPublicUseCase,
		updateBoardApplication,
		deleteBoardUseCase,
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
	controllers: [BoardsController, PublicBoardsController],
	exports: [createBoardService, getBoardService, updateBoardService, deleteBoardService]
})
export default class BoardsModule {}

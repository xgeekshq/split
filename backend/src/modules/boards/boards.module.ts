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
	getDashboardBoardsUseCase,
	getPersonalBoardsUseCase,
	isBoardPublicUseCase,
	mergeBoardUseCase,
	pauseBoardTimerService,
	sendBoardTimerStateService,
	sendBoardTimerTimeLeftService,
	startBoardTimerService,
	stopBoardTimerService,
	updateBoardParticipantsUseCase,
	updateBoardPhaseUseCase,
	updateBoardService,
	updateBoardTimerDurationService,
	updateBoardUseCase
} from './boards.providers';
import BoardsController from './controller/boards.controller';
import TeamUsersModule from 'src/modules/teamUsers/teamusers.module';
import PublicBoardsController from './controller/publicBoards.controller';
import { VotesModule } from '../votes/votes.module';

@Module({
	imports: [
		UsersModule,
		forwardRef(() => TeamsModule),
		TeamUsersModule,
		SchedulesModule,
		CommunicationModule,
		CardsModule,
		forwardRef(() => AuthModule),
		forwardRef(() => VotesModule),
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
		getDashboardBoardsUseCase,
		getAllBoardsUseCase,
		getPersonalBoardsUseCase,
		getBoardUseCase,
		createBoardUseCase,
		isBoardPublicUseCase,
		updateBoardUseCase,
		updateBoardParticipantsUseCase,
		updateBoardPhaseUseCase,
		mergeBoardUseCase,
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

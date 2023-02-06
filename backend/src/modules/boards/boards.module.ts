import { Module, forwardRef } from '@nestjs/common';
import {
	mongooseBoardModule,
	mongooseBoardUserModule
} from 'src/infrastructure/database/mongoose.module';
import { CommunicationModule } from 'src/modules/communication/communication.module';
import { SchedulesModule } from 'src/modules/schedules/schedules.module';
import TeamsModule from 'src/modules/teams/teams.module';
import UsersModule from 'src/modules/users/users.module';
import { CardsModule } from '../cards/cards.module';
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
		forwardRef(() => TeamsModule),
		SchedulesModule,
		CommunicationModule,
		CardsModule,
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
	exports: [
		getBoardApplication,
		createBoardService,
		getBoardService,
		updateBoardService,
		deleteBoardService
	]
})
export default class BoardsModule {}

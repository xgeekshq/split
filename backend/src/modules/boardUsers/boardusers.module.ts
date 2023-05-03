import { Module, forwardRef } from '@nestjs/common';
import {
	boardUserRepository,
	createBoardUserService,
	deleteBoardUserService,
	getBoardUserService,
	updateBoardUserService,
	updateBoardUsersUseCase
} from './boardusers.providers';
import { mongooseBoardUserModule } from 'src/infrastructure/database/mongoose.module';
import BoardUsersController from './controller/board-user.controller';
import BoardsModule from '../boards/boards.module';
import TeamUsersModule from '../teamUsers/teamusers.module';

@Module({
	imports: [
		mongooseBoardUserModule,
		forwardRef(() => BoardsModule),
		forwardRef(() => TeamUsersModule)
	],
	providers: [
		updateBoardUsersUseCase,
		createBoardUserService,
		getBoardUserService,
		updateBoardUserService,
		deleteBoardUserService,
		boardUserRepository
	],
	controllers: [BoardUsersController],
	exports: [
		createBoardUserService,
		getBoardUserService,
		updateBoardUserService,
		deleteBoardUserService,
		boardUserRepository
	]
})
export default class BoardUsersModule {}

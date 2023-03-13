import { Module } from '@nestjs/common';
import {
	boardUserRepository,
	createBoardUserService,
	deleteBoardUserService,
	getBoardUserService,
	updateBoardUserService
} from './boardusers.providers';
import { mongooseBoardUserModule } from 'src/infrastructure/database/mongoose.module';

@Module({
	imports: [mongooseBoardUserModule],
	providers: [
		createBoardUserService,
		getBoardUserService,
		updateBoardUserService,
		deleteBoardUserService,
		boardUserRepository
	],
	controllers: [],
	exports: [
		createBoardUserService,
		getBoardUserService,
		updateBoardUserService,
		deleteBoardUserService,
		boardUserRepository
	]
})
export default class BoardUsersModule {}

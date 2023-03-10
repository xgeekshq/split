import { Module } from '@nestjs/common';
import {
	boardUserRepository,
	createBoardUserService,
	deleteBoardUserService,
	getBoardUserService,
	updateBoardUserService
} from './boardusers.providers';

@Module({
	imports: [],
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

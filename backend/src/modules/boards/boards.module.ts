import { Module } from '@nestjs/common';
import BoardsController from './controller/boards.controller';
import UsersModule from '../users/users.module';
import {
  createBoardService,
  updateBoardService,
  deleteBoardService,
  getBoardService,
  createBoardApplication,
  updateBoardApplication,
  deleteBoardApplication,
  getBoardApplication,
} from './boards.providers';
import {
  mongooseBoardModule,
  mongooseBoardUserModule,
} from '../../infrastructure/database/mongoose.module';

@Module({
  imports: [UsersModule, mongooseBoardModule, mongooseBoardUserModule],
  providers: [
    createBoardService,
    updateBoardService,
    deleteBoardService,
    getBoardService,
    createBoardApplication,
    updateBoardApplication,
    deleteBoardApplication,
    getBoardApplication,
  ],
  controllers: [BoardsController],
  exports: [],
})
export default class BoardsModule {}

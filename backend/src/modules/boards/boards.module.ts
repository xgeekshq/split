import { Module } from '@nestjs/common';
import { mongooseModule } from 'src/infrastructure/database/mongoose.module';
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

@Module({
  imports: [UsersModule, mongooseModule],
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

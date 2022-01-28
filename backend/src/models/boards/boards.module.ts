import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ActionsModule from '../../socket/socket.module';
import BoardsService from './boards.service';
import BoardsController from './boards.controller';
import Board, { BoardSchema } from './schemas/board.schema';
import UsersModule from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => ActionsModule),
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
  ],
  providers: [BoardsService],
  controllers: [BoardsController],
  exports: [BoardsService],
})
export default class BoardsModule {}

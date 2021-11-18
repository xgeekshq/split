import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import BoardEntity from './entity/board.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity]), UsersModule],
  providers: [BoardsService],
  controllers: [BoardsController],
})
export class BoardsModule {}

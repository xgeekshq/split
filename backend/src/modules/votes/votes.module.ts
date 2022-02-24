import { Module } from '@nestjs/common';
import { mongooseBoardModule } from '../../infrastructure/database/mongoose.module';
import { CardsModule } from '../cards/cards.module';
import SocketModule from '../socket/socket.module';
import VotesController from './controller/votes.controller';
import {
  createVoteApplication,
  createVoteService,
  deleteVoteApplication,
  deleteVoteService,
} from './votes.providers';

@Module({
  imports: [mongooseBoardModule, CardsModule, SocketModule],
  controllers: [VotesController],
  providers: [
    createVoteApplication,
    createVoteService,
    deleteVoteApplication,
    deleteVoteService,
  ],
  exports: [],
})
export class VotesModule {}

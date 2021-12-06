import { Module } from '@nestjs/common';
import BoardsModule from 'src/boards/boards.module';
import ActionsGateway from './actions.gateway';

@Module({
  imports: [BoardsModule],
  providers: [ActionsGateway],
})
export default class ActionsModule {}

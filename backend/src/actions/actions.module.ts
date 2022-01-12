import { forwardRef, Module } from '@nestjs/common';
import BoardsModule from 'src/models/boards/boards.module';
import ActionsGateway from './actions.gateway';

@Module({
  imports: [forwardRef(() => BoardsModule)],
  providers: [ActionsGateway],
  exports: [ActionsGateway],
})
export default class ActionsModule {}

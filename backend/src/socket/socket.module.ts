import { forwardRef, Module } from '@nestjs/common';
import BoardsModule from 'src/models/boards/boards.module';
import SocketGateway from './socket.gateway';

@Module({
  imports: [forwardRef(() => BoardsModule)],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export default class ActionsModule {}

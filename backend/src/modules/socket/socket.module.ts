import { forwardRef, Module } from '@nestjs/common';
import BoardsModule from '../boards/boards.module';
import SocketGateway from './gateway/socket.gateway';

@Module({
  imports: [forwardRef(() => BoardsModule)],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export default class SocketModule {}

import { forwardRef, Global, Module } from '@nestjs/common';
import BoardsModule from '../boards/boards.module';
import SocketGateway from './gateway/socket.gateway';

@Global()
@Module({
  imports: [forwardRef(() => BoardsModule)],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export default class SocketModule {}

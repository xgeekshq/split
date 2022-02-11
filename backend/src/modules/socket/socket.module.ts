import { forwardRef, Module } from '@nestjs/common';
import BoardsModule from 'src/modules/boards/boards.module';
import SocketGateway from './gateway/socket.gateway';

@Module({
  imports: [forwardRef(() => BoardsModule)],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export default class SocketModule {}

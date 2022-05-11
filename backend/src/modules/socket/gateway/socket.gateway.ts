import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import JoinPayload from '../interfaces/joinPayload.interface';

@WebSocketGateway({ cors: true })
export default class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private logger: Logger = new Logger('AppGateway');

  sendUpdatedBoard(newBoardId: string, excludedClient: string) {
    this.server
      .to(newBoardId.toString())
      .except(excludedClient)
      .emit('updateAllBoard', newBoardId);
  }

  afterInit() {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: JoinPayload) {
    client.join(payload.boardId);
  }
}

import { LeanDocument } from 'mongoose';
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
import { BoardDocument } from '../../boards/schemas/board.schema';

@WebSocketGateway({ cors: true })
export default class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private logger: Logger = new Logger('AppGateway');

  sendUpdatedBoard(
    newBoard: LeanDocument<BoardDocument>,
    excludedClient: string,
  ) {
    this.server
      .to(newBoard._id.toString())
      .except(excludedClient)
      .emit('updateAllBoard', newBoard);
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
